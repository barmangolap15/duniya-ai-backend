import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService) {}

  async getChildren(parentId: string) {
    const links = await this.prisma.parentStudent.findMany({
      where: { parentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            xp: true,
            level: true,
            streak: true,
            headline: true,
            createdAt: true,
            roadmap: {
              include: {
                careerTrack: true,
              },
            },
            studentCheersRecv: {
              where: { parentId },
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            studentThreads: {
              orderBy: { updatedAt: 'desc' },
              include: {
                mentor: {
                  select: { id: true, name: true, avatarUrl: true, headline: true },
                },
                mission: {
                  select: { id: true, title: true },
                },
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
            submissions: {
              orderBy: { updatedAt: 'desc' },
              include: {
                mission: {
                  include: {
                    course: true,
                  },
                },
                reviews: {
                  include: {
                    mentor: {
                      select: { name: true, headline: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return links.map((link) => {
      const student = link.student;
      const completedSubmissions = student.submissions.filter(
        (s) => s.status === 'SUBMITTED' || s.status === 'APPROVED',
      );

      const estimatedHours = Math.max(1, Math.round(student.xp / 40));
      const completionRate = Math.min(100, Math.round((completedSubmissions.length / 10) * 100));

      const activeThreads = student.studentThreads || [];
      const totalInquiries = activeThreads.length;
      const waitingOnMentorCount = activeThreads.filter((t: any) => t.status === 'WAITING_ON_MENTOR').length;

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        avatarUrl: student.avatarUrl,
        xp: student.xp,
        level: student.level,
        streak: student.streak,
        headline: student.headline,
        trackName: student.roadmap?.careerTrack?.name || 'Exploring tracks',
        completedMissionsCount: completedSubmissions.length,
        completionRate,
        estimatedHours,
        joinedDate: student.createdAt,
        cheers: student.studentCheersRecv || [],
        mentorCommunications: {
          totalThreads: totalInquiries,
          waitingOnMentorCount,
          recentThreads: activeThreads.slice(0, 3).map((t: any) => ({
            id: t.id,
            subject: t.subject,
            mentorName: t.mentor?.name || 'Staff Mentor',
            mentorHeadline: t.mentor?.headline,
            status: t.status,
            updatedAt: t.updatedAt,
            lastMessage: t.messages?.[0]?.content || null,
          })),
        },
        recentActivity: completedSubmissions.slice(0, 5).map((s) => ({
          missionTitle: s.mission.title,
          courseName: s.mission.course.name,
          status: s.status,
          date: s.updatedAt,
          xp: s.xpEarned,
          review: s.reviews[0]?.feedback || null,
          rating: s.reviews[0]?.rating || null,
          mentorName: s.reviews[0]?.mentor?.name || null,
        })),
        strengths: [
          'Strong problem solving consistency',
          'Fast mission turnaround time',
          'Good semantic code structure',
        ],
      };
    });
  }

  async getChildCommunications(parentId: string, studentId: string) {
    const link = await this.prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!link) {
      throw new ForbiddenException('Student is not linked to your parent account');
    }

    const threads = await this.prisma.mentorshipThread.findMany({
      where: { studentId },
      orderBy: { updatedAt: 'desc' },
      include: {
        mentor: {
          select: { id: true, name: true, avatarUrl: true, headline: true, email: true },
        },
        mission: {
          select: { id: true, title: true, course: { select: { name: true } } },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { id: true, name: true, avatarUrl: true, role: true },
            },
          },
        },
      },
    });

    const reviews = await this.prisma.review.findMany({
      where: {
        submission: { userId: studentId },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: {
          select: { id: true, name: true, avatarUrl: true, headline: true },
        },
        submission: {
          include: {
            mission: { select: { title: true } },
          },
        },
      },
    });

    const cheers = await this.prisma.parentCheer.findMany({
      where: { parentId, studentId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      student: link.student,
      threads,
      reviews,
      cheers,
    };
  }

  async linkChild(parentId: string, studentEmail: string) {
    const student = await this.prisma.user.findUnique({
      where: { email: studentEmail.trim().toLowerCase() },
    });

    if (!student) {
      throw new NotFoundException(`Student with email ${studentEmail} not found`);
    }

    if (student.id === parentId) {
      throw new BadRequestException('You cannot link yourself as your own child');
    }

    const existing = await this.prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId: student.id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Child is already linked to your account');
    }

    return this.prisma.parentStudent.create({
      data: {
        parentId,
        studentId: student.id,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async sendCheer(parentId: string, studentId: string, message: string) {
    const link = await this.prisma.parentStudent.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId,
        },
      },
    });

    if (!link) {
      throw new BadRequestException('Child is not linked to your account');
    }

    // Persist cheer in DB
    const cheer = await this.prisma.parentCheer.create({
      data: {
        parentId,
        studentId,
        message: message.trim(),
        xpAwarded: 15,
      },
    });

    // Give a 15 XP parental encouragement boost to student
    await this.prisma.user.update({
      where: { id: studentId },
      data: {
        xp: { increment: 15 },
      },
    });

    return {
      success: true,
      cheer,
      message: `Cheer sent! Your child received a +15 XP motivation boost.`,
    };
  }
}
