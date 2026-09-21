import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        headline: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        xp: true,
        level: true,
        streak: true,
        avatarUrl: true,
        quizCompleted: true,
        createdAt: true,
        roadmap: {
          include: {
            careerTrack: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: string, data: {
    headline?: string;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    avatarUrl?: string;
    name?: string;
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        headline: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        xp: true,
        level: true,
        streak: true,
        avatarUrl: true,
        quizCompleted: true,
      },
    });
  }

  async getPublicPortfolio(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        headline: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        xp: true,
        level: true,
        streak: true,
        avatarUrl: true,
        createdAt: true,
        roadmap: {
          include: {
            careerTrack: true,
          },
        },
        submissions: {
          where: {
            status: { in: ['SUBMITTED', 'APPROVED'] },
          },
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
                  select: { name: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User portfolio not found');
    }

    // Aggregate skills from completed missions languages
    const skillMap: Record<string, number> = {};
    user.submissions.forEach((sub) => {
      sub.mission.languages.forEach((lang) => {
        skillMap[lang] = (skillMap[lang] || 0) + 1;
      });
    });

    return {
      ...user,
      skills: Object.entries(skillMap).map(([name, count]) => ({
        name: name.toUpperCase(),
        completedProjects: count,
      })),
      verifiedProjectsCount: user.submissions.length,
    };
  }
}