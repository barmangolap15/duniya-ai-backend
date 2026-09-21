import { Injectable, NotFoundException, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ALL_TRACKS } from './track-data';

@Injectable()
export class MissionsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MissionsService.name);

  constructor(private prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.ensureAllTracksAndMissions();
  }

  async ensureAllTracksAndMissions() {
    try {
      this.logger.log('Syncing all multi-technology career tracks and missions...');
      for (const trackData of ALL_TRACKS) {
        // Upsert CareerTrack
        const track = await this.prisma.careerTrack.upsert({
          where: { name: trackData.name },
          create: {
            name: trackData.name,
            description: trackData.description,
            icon: trackData.icon,
            color: trackData.color,
          },
          update: {
            description: trackData.description,
            icon: trackData.icon,
            color: trackData.color,
          },
        });

        for (const courseData of trackData.courses) {
          // Find or create course
          let course = await this.prisma.course.findFirst({
            where: { careerTrackId: track.id, name: courseData.name },
          });

          if (!course) {
            course = await this.prisma.course.create({
              data: {
                careerTrackId: track.id,
                name: courseData.name,
                description: courseData.description,
                order: courseData.order,
              },
            });
          }

          for (const mData of courseData.missions) {
            const existingMission = await this.prisma.mission.findFirst({
              where: { courseId: course.id, title: mData.title },
            });

            if (!existingMission) {
              await this.prisma.mission.create({
                data: {
                  courseId: course.id,
                  title: mData.title,
                  description: mData.description,
                  instructions: mData.instructions,
                  xpReward: mData.xpReward,
                  order: mData.order,
                  languages: mData.languages,
                  starterHtml: mData.starterHtml,
                  starterCss: mData.starterCss,
                  starterJs: mData.starterJs,
                  steps: mData.steps as any,
                },
              });
            }
          }
        }
      }
      this.logger.log('✅ Multi-technology tracks and missions successfully verified and seeded!');
    } catch (error) {
      this.logger.error('Failed to sync tracks and missions', error);
    }
  }

  async getAllTracks() {
    const tracks = await this.prisma.careerTrack.findMany({
      include: {
        courses: {
          include: {
            missions: {
              select: {
                id: true,
                title: true,
                description: true,
                xpReward: true,
                languages: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tracks.map((t) => {
      const allMissions = t.courses.flatMap((c) => c.missions);
      const totalXp = allMissions.reduce((acc, m) => acc + m.xpReward, 0);
      return {
        ...t,
        totalMissionsCount: allMissions.length,
        totalXp,
      };
    });
  }

  async switchTrack(userId: string, trackId: string) {
    const track = await this.prisma.careerTrack.findUnique({
      where: { id: trackId },
      include: { courses: { include: { missions: true } } },
    });
    if (!track) throw new NotFoundException('Career track not found');

    const roadmap = await this.prisma.userRoadmap.upsert({
      where: { userId },
      create: { userId, careerTrackId: trackId },
      update: { careerTrackId: trackId },
      include: { careerTrack: true },
    });

    return {
      success: true,
      track: {
        id: track.id,
        name: track.name,
        description: track.description,
        icon: track.icon,
        color: track.color,
      },
      roadmapId: roadmap.id,
    };
  }

  async getMissionsForUser(userId: string, trackId?: string) {
    let roadmap = await this.prisma.userRoadmap.findUnique({
      where: { userId },
      include: { careerTrack: true },
    });

    if (!roadmap) {
      const defaultTrack = await this.prisma.careerTrack.findFirst();
      if (defaultTrack) {
        roadmap = await this.prisma.userRoadmap.upsert({
          where: { userId },
          create: { userId, careerTrackId: defaultTrack.id },
          update: { careerTrackId: defaultTrack.id },
          include: { careerTrack: true },
        });
      }
    }

    const effectiveTrackId = trackId || roadmap?.careerTrackId;
    if (!effectiveTrackId) return [];

    const activeTrack = await this.prisma.careerTrack.findUnique({
      where: { id: effectiveTrackId },
    });

    const courses = await this.prisma.course.findMany({
      where: { careerTrackId: effectiveTrackId },
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

    return {
      activeTrackId: effectiveTrackId,
      activeTrack,
      isEnrolledTrack: roadmap?.careerTrackId === effectiveTrackId,
      courses,
    };
  }

  async getMissionDetail(missionId: string) {
    let mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        course: {
          include: {
            careerTrack: true,
          },
        },
      },
    });

    if (!mission) {
      mission = await this.prisma.mission.findFirst({
        orderBy: { order: 'asc' },
        include: {
          course: {
            include: {
              careerTrack: true,
            },
          },
        },
      });
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