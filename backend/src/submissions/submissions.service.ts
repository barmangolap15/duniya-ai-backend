import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async autosave(userId: string, data: any) {
    return this.prisma.submission.upsert({
      where: { userId_missionId: { userId, missionId: data.missionId } },
      update: {
        htmlCode: data.htmlCode || '',
        cssCode: data.cssCode || '',
        jsCode: data.jsCode || '',
        status: SubmissionStatus.IN_PROGRESS
      },
      create: {
        userId,
        missionId: data.missionId,
        htmlCode: data.htmlCode || '',
        cssCode: data.cssCode || '',
        jsCode: data.jsCode || '',
        status: SubmissionStatus.IN_PROGRESS
      }
    });
  }

  async submit(userId: string, data: any) {
    const mission = await this.prisma.mission.findUnique({ where: { id: data.missionId } });
    
    const submission = await this.prisma.submission.upsert({
      where: { userId_missionId: { userId, missionId: data.missionId } },
      update: {
        htmlCode: data.htmlCode || '',
        cssCode: data.cssCode || '',
        jsCode: data.jsCode || '',
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
        xpEarned: mission?.xpReward || 50,
      },
      create: {
        userId,
        missionId: data.missionId,
        htmlCode: data.htmlCode || '',
        cssCode: data.cssCode || '',
        jsCode: data.jsCode || '',
        status: SubmissionStatus.SUBMITTED,
        submittedAt: new Date(),
        xpEarned: mission?.xpReward || 50,
      }
    });

    await this.prisma.userMissionProgress.upsert({
      where: { userId_missionId: { userId, missionId: data.missionId } },
      update: { completed: true },
      create: { userId, missionId: data.missionId, completed: true }
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: mission?.xpReward || 50 } }
    });

    return submission;
  }

  async getPortfolio(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId, status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.APPROVED] } },
      include: { mission: true }
    });
  }
}