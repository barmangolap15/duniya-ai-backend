import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, ThreadStatus, ThreadPriority } from '@prisma/client';

@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async getThreads(user: { userId: string; role: Role }) {
    let whereClause: any = {};

    if (user.role === Role.STUDENT) {
      whereClause = { studentId: user.userId };
    } else if (user.role === Role.MENTOR) {
      // Mentors can see all threads or their assigned threads
      whereClause = {};
    } else if (user.role === Role.PARENT) {
      // Parents see threads of their linked children
      const links = await this.prisma.parentStudent.findMany({
        where: { parentId: user.userId },
        select: { studentId: true },
      });
      const studentIds = links.map((l) => l.studentId);
      whereClause = { studentId: { in: studentIds } };
    }

    const threads = await this.prisma.mentorshipThread.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            level: true,
            xp: true,
            streak: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            headline: true,
          },
        },
        mission: {
          select: {
            id: true,
            title: true,
            course: {
              select: { name: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return threads;
  }

  async getThread(threadId: string, user: { userId: string; role: Role }) {
    const thread = await this.prisma.mentorshipThread.findUnique({
      where: { id: threadId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            level: true,
            xp: true,
            streak: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            headline: true,
          },
        },
        mission: {
          select: {
            id: true,
            title: true,
            course: { select: { name: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // Authorization verification
    if (user.role === Role.STUDENT && thread.studentId !== user.userId) {
      throw new ForbiddenException('Not authorized to access this thread');
    }

    if (user.role === Role.PARENT) {
      const link = await this.prisma.parentStudent.findUnique({
        where: {
          parentId_studentId: {
            parentId: user.userId,
            studentId: thread.studentId,
          },
        },
      });
      if (!link) {
        throw new ForbiddenException('You are not linked to this student');
      }
    }

    return thread;
  }

  async createThread(
    user: { userId: string; role: Role },
    data: {
      mentorId?: string;
      studentId?: string;
      missionId?: string;
      subject: string;
      message: string;
      codeSnippet?: string;
      stepNumber?: number;
      priority?: ThreadPriority;
    },
  ) {
    let studentId = user.userId;
    let mentorId = data.mentorId;

    if (user.role === Role.MENTOR) {
      if (!data.studentId) {
        throw new BadRequestException('Student ID is required when mentor initiates thread');
      }
      studentId = data.studentId;
      mentorId = user.userId;
    } else {
      // If student hasn't specified mentor, find default mentor
      if (!mentorId) {
        const defaultMentor = await this.prisma.user.findFirst({
          where: { role: Role.MENTOR },
        });
        if (!defaultMentor) {
          throw new NotFoundException('No available mentor found in the platform');
        }
        mentorId = defaultMentor.id;
      }
    }

    let validMissionId: string | null = null;
    if (data.missionId) {
      const missionExists = await this.prisma.mission.findUnique({
        where: { id: data.missionId },
      });
      if (missionExists) {
        validMissionId = missionExists.id;
      }
    }

    const thread = await this.prisma.mentorshipThread.create({
      data: {
        studentId,
        mentorId,
        missionId: validMissionId,
        subject: data.subject,
        priority: data.priority || ThreadPriority.NORMAL,
        status: user.role === Role.STUDENT ? ThreadStatus.WAITING_ON_MENTOR : ThreadStatus.WAITING_ON_STUDENT,
        messages: {
          create: {
            senderId: user.userId,
            senderRole: user.role,
            content: data.message,
            codeSnippet: data.codeSnippet || null,
            stepNumber: data.stepNumber || null,
          },
        },
      },
      include: {
        student: { select: { id: true, name: true, avatarUrl: true } },
        mentor: { select: { id: true, name: true, avatarUrl: true, headline: true } },
        mission: { select: { id: true, title: true } },
        messages: {
          include: {
            sender: { select: { id: true, name: true, avatarUrl: true, role: true } },
          },
        },
      },
    });

    return thread;
  }

  async addMessage(
    threadId: string,
    user: { userId: string; role: Role },
    data: { content: string; codeSnippet?: string; stepNumber?: number },
  ) {
    const thread = await this.prisma.mentorshipThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (user.role === Role.STUDENT && thread.studentId !== user.userId) {
      throw new ForbiddenException('Not authorized');
    }

    // Determine new status
    const newStatus =
      user.role === Role.MENTOR
        ? ThreadStatus.WAITING_ON_STUDENT
        : ThreadStatus.WAITING_ON_MENTOR;

    const message = await this.prisma.mentorshipMessage.create({
      data: {
        threadId,
        senderId: user.userId,
        senderRole: user.role,
        content: data.content,
        codeSnippet: data.codeSnippet || null,
        stepNumber: data.stepNumber || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    await this.prisma.mentorshipThread.update({
      where: { id: threadId },
      data: {
        updatedAt: new Date(),
        status: newStatus,
      },
    });

    return message;
  }

  async updateStatus(
    threadId: string,
    user: { userId: string; role: Role },
    status: ThreadStatus,
  ) {
    const thread = await this.prisma.mentorshipThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return this.prisma.mentorshipThread.update({
      where: { id: threadId },
      data: { status },
    });
  }

  async getAvailableMentors() {
    const mentors = await this.prisma.user.findMany({
      where: { role: Role.MENTOR },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        headline: true,
        bio: true,
        _count: {
          select: {
            reviewsGiven: true,
            mentorThreads: true,
          },
        },
      },
    });

    return mentors;
  }
}
