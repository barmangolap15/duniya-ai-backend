import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MissionsService {
  constructor(private prisma: PrismaService) {}

  async getMissionsForUser(userId: string) {
    const roadmap = await this.prisma.userRoadmap.findUnique({ where: { userId } });
    if (!roadmap) return [];

    const courses = await this.prisma.course.findMany({
      where: { careerTrackId: roadmap.careerTrackId },
      include: {
        missions: {
          orderBy: { order: 'asc' },
          include: {
            submissions: { where: { userId } },
            progress: { where: { userId } }
          }
        }
      },
      orderBy: { order: 'asc' }
    });
    return courses;
  }

  async getMissionDetail(missionId: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission not found');
    return mission;
  }

  async getMissionSubmission(userId: string, missionId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { userId_missionId: { userId, missionId } }
    });
    return submission || {};
  }
}