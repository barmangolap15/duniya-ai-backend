import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roadmap: { include: { careerTrack: true } } },
    });

    let careerTrackId = user?.roadmap?.careerTrackId;
    if (!careerTrackId) {
      const defaultTrack = await this.prisma.careerTrack.findFirst();
      if (defaultTrack) {
        careerTrackId = defaultTrack.id;
        await this.prisma.userRoadmap.upsert({
          where: { userId },
          create: { userId, careerTrackId: defaultTrack.id },
          update: { careerTrackId: defaultTrack.id },
        }).catch(() => {});
      }
    }

    // Get all missions for the user's career track
    const courses = careerTrackId
      ? await this.prisma.course.findMany({
          where: { careerTrackId },
          include: {
            missions: {
              orderBy: { order: 'asc' },
              include: {
                submissions: { where: { userId } },
              },
            },
          },
          orderBy: { order: 'asc' },
        })
      : [];

    // Flatten all missions
    const allMissions = courses.flatMap((c) =>
      c.missions.map((m) => ({ ...m, courseName: c.name })),
    );

    // Count completed (submitted or approved)
    const completedMissions = allMissions.filter((m) =>
      m.submissions.some(
        (s) => s.status === 'SUBMITTED' || s.status === 'APPROVED',
      ),
    );

    // Get next 3 uncompleted missions
    const activeMissions = allMissions
      .filter(
        (m) =>
          !m.submissions.some(
            (s) => s.status === 'SUBMITTED' || s.status === 'APPROVED',
          ),
      )
      .slice(0, 3)
      .map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        xpReward: m.xpReward,
        languages: m.languages,
        courseName: m.courseName,
      }));

    const recentSubmissions = await this.prisma.submission.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        mission: true,
        reviews: {
          include: { mentor: { select: { name: true, headline: true, avatarUrl: true } } },
        },
      },
    });

    const recentCheers = await this.prisma.parentCheer.findMany({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        parent: { select: { name: true, avatarUrl: true } },
      },
    });

    const mentorshipThreads = await this.prisma.mentorshipThread.findMany({
      where: { studentId: userId },
      orderBy: { updatedAt: 'desc' },
      take: 4,
      include: {
        mentor: { select: { name: true, headline: true, avatarUrl: true } },
        mission: { select: { title: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const totalMissions = allMissions.length;
    const completionPercentage =
      totalMissions > 0
        ? Math.round((completedMissions.length / totalMissions) * 100)
        : 0;

    return {
      stats: { xp: user?.xp || 0, level: user?.level || 1, streak: user?.streak || 0 },
      careerTrack: user?.roadmap?.careerTrack || null,
      activeMissions,
      completedMissions: completedMissions.length,
      totalMissions,
      completionPercentage,
      recentSubmissions,
      recentCheers,
      mentorshipThreads,
    };
  }
}