import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecruiterService {
  constructor(private prisma: PrismaService) {}

  async getCandidates(
    recruiterId: string,
    filters?: { track?: string; search?: string; minLevel?: number },
  ) {
    const whereClause: any = {
      role: 'STUDENT',
    };

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { headline: { contains: filters.search, mode: 'insensitive' } },
        { bio: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.minLevel) {
      whereClause.level = { gte: Number(filters.minLevel) };
    }

    const students = await this.prisma.user.findMany({
      where: whereClause,
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
      take: 50,
      include: {
        roadmap: {
          include: {
            careerTrack: true,
          },
        },
        submissions: {
          where: {
            status: { in: ['SUBMITTED', 'APPROVED'] },
          },
          include: {
            mission: {
              include: {
                course: true,
              },
            },
            reviews: true,
          },
        },
        savedByRecruiters: {
          where: { recruiterId },
        },
      },
    });

    // Optional track filter
    let filtered = students;
    if (filters?.track && filters.track !== 'ALL') {
      filtered = students.filter(
        (s) => s.roadmap?.careerTrack?.name === filters.track,
      );
    }

    return filtered.map((s) => {
      const skills = Array.from(
        new Set(
          s.submissions.flatMap((sub) => sub.mission.languages.map((l) => l.toUpperCase())),
        ),
      );

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        headline: s.headline || 'Frontend Developer & UI Specialist',
        bio: s.bio,
        avatarUrl: s.avatarUrl,
        githubUrl: s.githubUrl,
        linkedinUrl: s.linkedinUrl,
        xp: s.xp,
        level: s.level,
        streak: s.streak,
        trackName: s.roadmap?.careerTrack?.name || 'Full-Stack Development',
        verifiedProjectsCount: s.submissions.length,
        skills: skills.length > 0 ? skills : ['HTML', 'CSS', 'JAVASCRIPT'],
        topProjects: s.submissions.slice(0, 3).map((sub) => ({
          title: sub.mission.title,
          courseName: sub.mission.course.name,
          languages: sub.mission.languages,
          approved: sub.status === 'APPROVED',
          reviewsCount: sub.reviews.length,
        })),
        isBookmarked: s.savedByRecruiters.length > 0,
      };
    });
  }

  async toggleBookmark(recruiterId: string, studentId: string) {
    const existing = await this.prisma.savedCandidate.findUnique({
      where: {
        recruiterId_studentId: {
          recruiterId,
          studentId,
        },
      },
    });

    if (existing) {
      await this.prisma.savedCandidate.delete({
        where: { id: existing.id },
      });
      return { bookmarked: false };
    } else {
      await this.prisma.savedCandidate.create({
        data: {
          recruiterId,
          studentId,
        },
      });
      return { bookmarked: true };
    }
  }

  async getSavedCandidates(recruiterId: string) {
    const saved = await this.prisma.savedCandidate.findMany({
      where: { recruiterId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          include: {
            roadmap: {
              include: {
                careerTrack: true,
              },
            },
            submissions: {
              where: {
                status: { in: ['SUBMITTED', 'APPROVED'] },
              },
              include: {
                mission: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return saved.map((item) => ({
      id: item.student.id,
      name: item.student.name,
      email: item.student.email,
      headline: item.student.headline,
      avatarUrl: item.student.avatarUrl,
      xp: item.student.xp,
      level: item.student.level,
      trackName: item.student.roadmap?.careerTrack?.name || 'Frontend Developer',
      verifiedProjectsCount: item.student.submissions.length,
      savedAt: item.createdAt,
    }));
  }

  async sendOutreach(
    recruiterId: string,
    studentId: string,
    data: { roleTitle: string; company: string; note: string },
  ) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Candidate not found');
    }

    return {
      success: true,
      message: `Interview invitation sent to ${student.name} for the position of ${data.roleTitle} at ${data.company}.`,
    };
  }
}
