import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('recruiter')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('candidates')
  getCandidates(
    @Request() req: any,
    @Query('track') track?: string,
    @Query('search') search?: string,
    @Query('minLevel') minLevel?: string,
  ) {
    return this.recruiterService.getCandidates(req.user.userId, {
      track,
      search,
      minLevel: minLevel ? parseInt(minLevel, 10) : undefined,
    });
  }

  @Post('bookmark/:studentId')
  toggleBookmark(@Request() req: any, @Param('studentId') studentId: string) {
    return this.recruiterService.toggleBookmark(req.user.userId, studentId);
  }

  @Get('saved')
  getSaved(@Request() req: any) {
    return this.recruiterService.getSavedCandidates(req.user.userId);
  }

  @Post('outreach/:studentId')
  sendOutreach(
    @Request() req: any,
    @Param('studentId') studentId: string,
    @Body() body: { roleTitle: string; company: string; note: string },
  ) {
    return this.recruiterService.sendOutreach(req.user.userId, studentId, body);
  }
}
