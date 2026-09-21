import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('queue')
  getQueue(@Query('status') status?: string) {
    return this.mentorService.getReviewQueue(status);
  }

  @Post('review/:submissionId')
  submitReview(
    @Request() req: any,
    @Param('submissionId') submissionId: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; feedback: string; rating: number },
  ) {
    return this.mentorService.submitReview(req.user.userId, submissionId, body);
  }

  @Get('stats')
  getStats(@Request() req: any) {
    return this.mentorService.getMentorStats(req.user.userId);
  }

  @Get('mentees')
  getMentees(@Request() req: any) {
    return this.mentorService.getMentees(req.user.userId);
  }
}
