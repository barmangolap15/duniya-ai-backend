import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getMissionsForUser(userId: string) {
    let roadmap = await this.prisma.userRoadmap.findUnique({ where: { userId } });
    if (!roadmap) {
      const defaultTrack = await this.prisma.careerTrack.findFirst();
      if (defaultTrack) {
        roadmap = await this.prisma.userRoadmap.upsert({
          where: { userId },
          create: { userId, careerTrackId: defaultTrack.id },
          update: { careerTrackId: defaultTrack.id },
        });
      }
    }
    if (!roadmap) return [];

    const courses = await this.prisma.course.findMany({
      where: { careerTrackId: roadmap.careerTrackId },
      include: {
        missions: {
          orderBy: { order: 'asc' },
          include: {
            submissions: { where: { userId } },
            progress: { where: { userId } },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
    return courses;
  }

  async getMissionDetail(missionId: string) {
    let mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      // Fallback: if 'workspace' or invalid placeholder passed, grab the first available mission
      mission = await this.prisma.mission.findFirst({ orderBy: { order: 'asc' } });
    }
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async getMissionSubmission(userId: string, missionId: string) {
    let submission = await this.prisma.submission.findUnique({
      where: { userId_missionId: { userId, missionId } },
    });
    if (!submission && (missionId === 'workspace' || missionId === 'demo')) {
      const firstMission = await this.prisma.mission.findFirst({ orderBy: { order: 'asc' } });
      if (firstMission) {
        submission = await this.prisma.submission.findUnique({
          where: { userId_missionId: { userId, missionId: firstMission.id } },
        });
      }
    }
    return submission || {};
  }
}