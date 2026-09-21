import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MentorService {
  constructor(private prisma: PrismaService) {}

  async getReviewQueue(statusFilter?: string) {
    const whereClause: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    } else {
      whereClause.status = { in: ['SUBMITTED', 'IN_PROGRESS', 'APPROVED', 'REJECTED'] };
    }

    const submissions = await this.prisma.submission.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            xp: true,
            level: true,
            streak: true,
          },
        },
        mission: {
          include: {
            course: true,
          },
        },
        reviews: {
          include: {
            mentor: {
              select: { name: true },
            },
          },
        },
      },
    });

    return submissions.map((sub) => ({
      id: sub.id,
      studentId: sub.user.id,
      studentName: sub.user.name,
      studentEmail: sub.user.email,
      studentAvatar: sub.user.avatarUrl,
      studentLevel: sub.user.level,
      studentXp: sub.user.xp,
      studentStreak: sub.user.streak,
      missionId: sub.mission.id,
      missionTitle: sub.mission.title,
      courseName: sub.mission.course.name,
      instructions: sub.mission.instructions,
      languages: sub.mission.languages,
      htmlCode: sub.htmlCode,
      cssCode: sub.cssCode,
      jsCode: sub.jsCode,
      status: sub.status,
      submittedAt: sub.updatedAt,
      reviews: sub.reviews,
    }));
  }

  async submitReview(
    mentorId: string,
    submissionId: string,
    data: { status: 'APPROVED' | 'REJECTED'; feedback: string; rating: number },
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { user: true },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Update submission status
    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: data.status,
      },
    });

    // Create review
    const review = await this.prisma.review.create({
      data: {
        submissionId,
        mentorId,
        feedback: data.feedback,
        rating: data.rating || 5,
      },
    });

    // Award bonus XP if approved
    if (data.status === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: submission.userId },
        data: {
          xp: { increment: 35 },
        },
      });
    }

    return {
      success: true,
      submission: updatedSubmission,
      review,
    };
  }

  async getMentorStats(mentorId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { mentorId },
    });

    const pendingCount = await this.prisma.submission.count({
      where: { status: 'SUBMITTED' },
    });

    const totalStudents = await this.prisma.user.count({
      where: { role: 'STUDENT' },
    });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '5.0';

    const openThreadsCount = await this.prisma.mentorshipThread.count({
      where: {
        status: { in: ['OPEN', 'WAITING_ON_MENTOR'] },
      },
    });

    return {
      reviewsCompleted: reviews.length,
      pendingQueueCount: pendingCount,
      averageRating: avgRating,
      totalStudentsGuided: totalStudents,
      openThreadsCount,
    };
  }

  async getMentees(mentorId: string) {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        level: true,
        xp: true,
        streak: true,
        headline: true,
        submissions: {
          orderBy: { updatedAt: 'desc' },
          take: 3,
          include: {
            mission: { select: { title: true } },
            reviews: {
              where: { mentorId },
              take: 1,
            },
          },
        },
        studentThreads: {
          orderBy: { updatedAt: 'desc' },
          take: 2,
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    return students.map((s) => ({
      ...s,
      recentSubmissions: s.submissions,
      recentInquiries: s.studentThreads,
      hasPendingQuestion: s.studentThreads.some((t: any) => t.status === 'WAITING_ON_MENTOR' || t.status === 'OPEN'),
    }));
  }
}
