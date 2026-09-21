import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role || 'STUDENT',
      },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email, role: user.role });
    return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  }

  async getProfile(userId: string) {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        xp: true,
        level: true,
        streak: true,
        quizCompleted: true,
        roadmap: {
          include: {
            careerTrack: {
              include: {
                courses: {
                  include: {
                    missions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user && user.role === 'STUDENT' && !user.roadmap) {
      const defaultTrack = await this.prisma.careerTrack.findFirst({
        include: {
          courses: {
            include: {
              missions: true,
            },
          },
        },
      });

      if (defaultTrack) {
        await this.prisma.userRoadmap.upsert({
          where: { userId },
          create: { userId, careerTrackId: defaultTrack.id },
          update: { careerTrackId: defaultTrack.id },
        }).catch(() => {});

        user = {
          ...user,
          roadmap: {
            id: 'auto',
            userId,
            careerTrackId: defaultTrack.id,
            createdAt: new Date(),
            careerTrack: defaultTrack,
          } as any,
        };
      }
    }

    const track = user?.roadmap?.careerTrack
      ? {
          id: user.roadmap.careerTrack.id,
          name: user.roadmap.careerTrack.name,
          description: user.roadmap.careerTrack.description,
          courses: user.roadmap.careerTrack.courses.map((c) => ({
            id: c.id,
            title: c.name,
            name: c.name,
            description: c.description,
            missions: c.missions,
          })),
        }
      : null;

    return {
      ...user,
      track,
    };
  }
}