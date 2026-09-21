import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface QuizQuestionOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  trackWeights: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  options: QuizQuestionOption[];
}

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  private questions: QuizQuestion[] = [
    {
      id: 'experience',
      title: 'What is your current coding background?',
      subtitle: 'We will tailor your learning curve and starting challenges accordingly.',
      category: 'Skill Level',
      options: [
        {
          id: 'beginner',
          label: 'Complete Beginner',
          description: 'Never coded before. Ready to learn the fundamentals from the ground up.',
          icon: 'Sprout',
          trackWeights: {
            'Frontend Web Development': 30,
            'UX/UI Design': 25,
            'Full-Stack Development': 15,
            'Backend Development': 10,
            'Mobile App Development': 10,
          },
        },
        {
          id: 'some_basics',
          label: 'Familiar with Basics',
          description: 'Know basic HTML/CSS or tried a few syntax tutorials in Python/JS.',
          icon: 'Code2',
          trackWeights: {
            'Frontend Web Development': 25,
            'Full-Stack Development': 25,
            'Backend Development': 20,
            'Mobile App Development': 20,
            'UX/UI Design': 15,
          },
        },
        {
          id: 'intermediate',
          label: 'Intermediate / College Learner',
          description: 'Built small projects, understand OOP/data structures, seeking production-grade skills.',
          icon: 'Rocket',
          trackWeights: {
            'Full-Stack Development': 35,
            'Backend Development': 30,
            'Mobile App Development': 25,
            'Frontend Web Development': 15,
            'UX/UI Design': 10,
          },
        },
      ],
    },
    {
      id: 'interest',
      title: 'What kind of projects excite you the most?',
      subtitle: 'Choose what you dream of creating in the real world.',
      category: 'Primary Interest',
      options: [
        {
          id: 'frontend',
          label: 'Interactive Websites & Web Apps',
          description: 'Sleek UI animations, dynamic user interactions, responsive modern layouts.',
          icon: 'Layout',
          trackWeights: {
            'Frontend Web Development': 45,
            'UX/UI Design': 20,
            'Full-Stack Development': 15,
          },
        },
        {
          id: 'backend',
          label: 'Scalable APIs & Cloud Architecture',
          description: 'High-performance databases, microservices, authentication, and secure servers.',
          icon: 'Server',
          trackWeights: {
            'Backend Development': 45,
            'Full-Stack Development': 20,
          },
        },
        {
          id: 'fullstack',
          label: 'End-to-End Complete Applications',
          description: 'Mastering both client-side interfaces and cloud databases together seamlessly.',
          icon: 'Layers',
          trackWeights: {
            'Full-Stack Development': 45,
            'Frontend Web Development': 20,
            'Backend Development': 20,
          },
        },
        {
          id: 'mobile',
          label: 'Native Mobile Apps (iOS & Android)',
          description: 'Touch gestures, camera integration, mobile sensors, and App Store products.',
          icon: 'Smartphone',
          trackWeights: {
            'Mobile App Development': 45,
            'Frontend Web Development': 15,
          },
        },
        {
          id: 'design',
          label: 'Product UX/UI & Visual Prototypes',
          description: 'Design systems, user research, wireframing, and creating delightful experiences.',
          icon: 'Palette',
          trackWeights: {
            'UX/UI Design': 45,
            'Frontend Web Development': 25,
          },
        },
      ],
    },
    {
      id: 'goal',
      title: 'What is your primary goal right now?',
      subtitle: 'This helps us prioritize industry skills vs. academic fundamentals.',
      category: 'Career Objective',
      options: [
        {
          id: 'job_ready',
          label: 'Land a Job or Tech Internship',
          description: 'Build a recruiter-ready portfolio, complete verified code reviews, and earn badges.',
          icon: 'Briefcase',
          trackWeights: {
            'Full-Stack Development': 30,
            'Frontend Web Development': 25,
            'Backend Development': 25,
            'Mobile App Development': 20,
          },
        },
        {
          id: 'startup',
          label: 'Launch My Own Startup or Indie App',
          description: 'Build MVP products quickly, launch full applications, and iterate fast.',
          icon: 'Sparkles',
          trackWeights: {
            'Full-Stack Development': 30,
            'Mobile App Development': 25,
            'Frontend Web Development': 25,
            'UX/UI Design': 20,
          },
        },
        {
          id: 'academic',
          label: 'Academic & School Excellence',
          description: 'Master CS concepts, ace exams, and build a strong foundational understanding.',
          icon: 'GraduationCap',
          trackWeights: {
            'Backend Development': 30,
            'Frontend Web Development': 25,
            'Full-Stack Development': 20,
          },
        },
        {
          id: 'curiosity',
          label: 'Creative Exploration & Fun',
          description: 'Solve interactive puzzles, try new technologies, and learn at my own leisure.',
          icon: 'Compass',
          trackWeights: {
            'Frontend Web Development': 25,
            'UX/UI Design': 25,
            'Mobile App Development': 20,
          },
        },
      ],
    },
    {
      id: 'style',
      title: 'How do you learn best?',
      subtitle: 'We adapt how challenges and mentor reviews are presented.',
      category: 'Learning Style',
      options: [
        {
          id: 'visual_builder',
          label: 'Hands-on Instant Feedback',
          description: 'Type code and see the visual output render in real-time step by step.',
          icon: 'Eye',
          trackWeights: {
            'Frontend Web Development': 25,
            'UX/UI Design': 25,
            'Mobile App Development': 20,
          },
        },
        {
          id: 'logic_puzzler',
          label: 'Algorithmic Problem Solving',
          description: 'Solving complex logic riddles, data transformations, and system optimizations.',
          icon: 'Cpu',
          trackWeights: {
            'Backend Development': 30,
            'Full-Stack Development': 25,
          },
        },
        {
          id: 'project_creator',
          label: 'Building Real Working Features',
          description: 'Creating complete functional features from scratch to deploy live.',
          icon: 'Hammer',
          trackWeights: {
            'Full-Stack Development': 30,
            'Frontend Web Development': 20,
            'Mobile App Development': 20,
          },
        },
      ],
    },
    {
      id: 'commitment',
      title: 'What is your weekly time commitment?',
      subtitle: 'We adjust milestone milestones and streak goals to your pace.',
      category: 'Pace & Rhythm',
      options: [
        {
          id: 'casual',
          label: 'Casual (1 – 3 Hours / week)',
          description: 'Bite-sized daily 15-minute missions that fit around your busy schedule.',
          icon: 'Clock',
          trackWeights: {
            'Frontend Web Development': 15,
            'UX/UI Design': 15,
          },
        },
        {
          id: 'dedicated',
          label: 'Dedicated (4 – 8 Hours / week)',
          description: 'Steady consistent pace with weekly mentor feedback and progress reviews.',
          icon: 'Zap',
          trackWeights: {
            'Full-Stack Development': 20,
            'Frontend Web Development': 20,
            'Backend Development': 20,
          },
        },
        {
          id: 'intensive',
          label: 'Fast-Track Bootcamp (8+ Hours / week)',
          description: 'Accelerated immersion to build full-stack mastery in record time.',
          icon: 'Flame',
          trackWeights: {
            'Full-Stack Development': 25,
            'Backend Development': 25,
            'Mobile App Development': 20,
          },
        },
      ],
    },
  ];

  getTrackPersona(trackName: string) {
    const lower = (trackName || '').toLowerCase();
    if (lower.includes('frontend')) {
      return {
        personaTitle: 'Frontend Developer',
        personaDescription: 'Based on your answers, you have a keen eye for design and enjoy building interactive user experiences.',
        avatarBadge: '🎨',
      };
    }
    if (lower.includes('backend')) {
      return {
        personaTitle: 'Backend Systems Developer',
        personaDescription: 'Based on your answers, you love solving architectural puzzles, working with data, and building scalable cloud APIs.',
        avatarBadge: '⚙️',
      };
    }
    if (lower.includes('full-stack') || lower.includes('fullstack')) {
      return {
        personaTitle: 'Full-Stack Engineer',
        personaDescription: 'Based on your answers, you thrive on connecting client interfaces and cloud server databases end-to-end.',
        avatarBadge: '🚀',
      };
    }
    if (lower.includes('mobile')) {
      return {
        personaTitle: 'Mobile App Developer',
        personaDescription: 'Based on your answers, you are passionate about building mobile-first native applications with touch interfaces.',
        avatarBadge: '📱',
      };
    }
    if (lower.includes('ux') || lower.includes('ui') || lower.includes('design')) {
      return {
        personaTitle: 'Product UX/UI Designer',
        personaDescription: 'Based on your answers, you enjoy understanding user psychology and crafting delightful digital workflows.',
        avatarBadge: '✨',
      };
    }
    return {
      personaTitle: `${trackName} Specialist`,
      personaDescription: 'Based on your answers, this specialized path provides the best balance of challenge, growth, and real-world projects.',
      avatarBadge: '💡',
    };
  }

  getQuestions() {
    return this.questions;
  }

  async submitQuiz(userId: string, answers: Array<{ questionId: string; optionId: string } | any>) {
    // 1. Fetch all tracks with courses and missions
    const tracks = await this.prisma.careerTrack.findMany({
      include: {
        courses: {
          include: {
            missions: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (!tracks || tracks.length === 0) {
      throw new NotFoundException('No career tracks available in the system');
    }

    // 2. Compute affinity scores per track
    const trackScores: Record<string, number> = {};
    for (const track of tracks) {
      trackScores[track.id] = 10; // Baseline score
    }

    const learnerProfile: Record<string, string> = {};

    for (const ans of answers || []) {
      const qId = ans.questionId || ans.id;
      const optId = ans.optionId || (typeof ans.value === 'string' ? ans.value : null);

      const question = this.questions.find((q) => q.id === qId);
      if (!question) continue;

      let selectedOption = question.options.find((o) => o.id === optId);
      if (!selectedOption && typeof ans.value === 'number') {
        // Fallback for numeric index
        selectedOption = question.options[ans.value % question.options.length];
      }

      if (selectedOption) {
        learnerProfile[question.id] = selectedOption.label;

        for (const [trackNameKeyword, weight] of Object.entries(selectedOption.trackWeights)) {
          const matchedTrack = tracks.find((t) =>
            t.name.toLowerCase().includes(trackNameKeyword.toLowerCase()),
          );
          if (matchedTrack) {
            trackScores[matchedTrack.id] = (trackScores[matchedTrack.id] || 0) + weight;
          }
        }
      }
    }

    // 3. Rank tracks by computed score
    const rankedTracks = tracks
      .map((track) => ({
        track,
        score: trackScores[track.id] || 10,
      }))
      .sort((a, b) => b.score - a.score);

    const topRanked = rankedTracks[0];
    const chosenTrack = topRanked.track;
    const secondaryRanked = rankedTracks.length > 1 ? rankedTracks[1] : null;

    // Calculate match percentage (normalize between 88% and 99% for best match feel)
    const maxScore = Math.max(...rankedTracks.map((r) => r.score), 50);
    const topMatchPct = Math.min(99, Math.max(88, Math.round((topRanked.score / maxScore) * 98)));
    const secondaryMatchPct = secondaryRanked
      ? Math.min(topMatchPct - 5, Math.max(72, Math.round((secondaryRanked.score / maxScore) * 94)))
      : 80;

    // 4. Extract recommended first course and first mission
    const firstCourse = chosenTrack.courses?.[0] || null;
    const firstMission = firstCourse?.missions?.[0] || null;
    const allMissions = chosenTrack.courses?.flatMap((c) => c.missions) || [];
    const totalXpReward = allMissions.reduce((acc, m) => acc + (m.xpReward || 50), 0);

    // 5. Generate tailored match reasons
    const matchReasons: string[] = [
      `Tailored to your goal: "${learnerProfile.goal || 'Master practical coding'}"`,
      `Optimal match for your preferred style: "${learnerProfile.interest || chosenTrack.name}"`,
      `Hands-on interactive missions with live compiler and mentor feedback`,
    ];

    // 6. Upsert QuizResponse & UserRoadmap
    await this.prisma.quizResponse.upsert({
      where: { userId },
      create: {
        userId,
        answers: answers as any,
        careerTrackId: chosenTrack.id,
      },
      update: {
        answers: answers as any,
        careerTrackId: chosenTrack.id,
      },
    });

    await this.prisma.userRoadmap.upsert({
      where: { userId },
      create: {
        userId,
        careerTrackId: chosenTrack.id,
      },
      update: {
        careerTrackId: chosenTrack.id,
      },
    });

    // Check if user is completing quiz for first time to grant bonus XP
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { quizCompleted: true },
    });

    const isFirstTime = !existingUser?.quizCompleted;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        quizCompleted: true,
        ...(isFirstTime ? { xp: { increment: 50 } } : {}),
      },
    });

    const persona = this.getTrackPersona(chosenTrack.name);
    const secondaryPersona = secondaryRanked ? this.getTrackPersona(secondaryRanked.track.name) : null;

    return {
      success: true,
      bonusXpAwarded: isFirstTime ? 50 : 0,
      recommendedTrack: {
        id: chosenTrack.id,
        name: chosenTrack.name,
        personaTitle: persona.personaTitle,
        personaDescription: persona.personaDescription,
        avatarBadge: persona.avatarBadge,
        description: chosenTrack.description,
        icon: chosenTrack.icon,
        matchScore: topMatchPct,
        matchReasons,
        totalCourses: chosenTrack.courses.length,
        totalMissions: allMissions.length,
        totalXp: totalXpReward,
        startingCourse: firstCourse
          ? {
              id: firstCourse.id,
              name: firstCourse.name,
              description: firstCourse.description,
              missionsCount: firstCourse.missions.length,
            }
          : null,
        firstMission: firstMission
          ? {
              id: firstMission.id,
              title: firstMission.title,
              description: firstMission.description,
              xpReward: firstMission.xpReward,
              languages: firstMission.languages,
            }
          : null,
      },
      secondaryTrack: secondaryRanked
        ? {
            id: secondaryRanked.track.id,
            name: secondaryRanked.track.name,
            personaTitle: secondaryPersona?.personaTitle,
            description: secondaryRanked.track.description,
            matchScore: secondaryMatchPct,
          }
        : null,
      learnerProfile,
    };
  }

  async getLatestRecommendation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        quizResponse: {
          include: {
            careerTrack: {
              include: {
                courses: {
                  include: {
                    missions: {
                      orderBy: { order: 'asc' },
                    },
                  },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
        roadmap: {
          include: {
            careerTrack: {
              include: {
                courses: {
                  include: {
                    missions: {
                      orderBy: { order: 'asc' },
                    },
                  },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const track = user.roadmap?.careerTrack || user.quizResponse?.careerTrack;
    if (!track) return null;

    const firstCourse = track.courses?.[0] || null;
    const firstMission = firstCourse?.missions?.[0] || null;
    const allMissions = track.courses?.flatMap((c) => c.missions) || [];

    return {
      quizCompleted: user.quizCompleted,
      track: {
        id: track.id,
        name: track.name,
        description: track.description,
        firstMission: firstMission
          ? {
              id: firstMission.id,
              title: firstMission.title,
              description: firstMission.description,
              xpReward: firstMission.xpReward,
              languages: firstMission.languages,
            }
          : null,
        totalMissions: allMissions.length,
      },
    };
  }
}