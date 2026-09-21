import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MentorshipService } from './mentorship.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThreadPriority, ThreadStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  @Get('threads')
  getThreads(@Request() req: any) {
    return this.mentorshipService.getThreads(req.user);
  }

  @Get('threads/:id')
  getThread(@Request() req: any, @Param('id') id: string) {
    return this.mentorshipService.getThread(id, req.user);
  }

  @Post('threads')
  createThread(
    @Request() req: any,
    @Body()
    body: {
      mentorId?: string;
      studentId?: string;
      missionId?: string;
      subject: string;
      message: string;
      codeSnippet?: string;
      stepNumber?: number;
      priority?: ThreadPriority;
    },
  ) {
    return this.mentorshipService.createThread(req.user, body);
  }

  @Post('threads/:id/messages')
  addMessage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { content: string; codeSnippet?: string; stepNumber?: number },
  ) {
    return this.mentorshipService.addMessage(id, req.user, body);
  }

  @Patch('threads/:id/status')
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: ThreadStatus,
  ) {
    return this.mentorshipService.updateStatus(id, req.user, status);
  }

  @Get('mentors')
  getMentors() {
    return this.mentorshipService.getAvailableMentors();
  }
}
