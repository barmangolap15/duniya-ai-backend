import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizModule } from './quiz/quiz.module';
import { MissionsModule } from './missions/missions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParentModule } from './parent/parent.module';
import { MentorModule } from './mentor/mentor.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { MentorshipModule } from './mentorship/mentorship.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    QuizModule,
    MissionsModule,
    SubmissionsModule,
    DashboardModule,
    ParentModule,
    MentorModule,
    MentorshipModule,
    RecruiterModule,
  ],
})
export class AppModule {}