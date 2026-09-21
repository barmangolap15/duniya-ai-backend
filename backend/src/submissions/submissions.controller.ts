import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('autosave')
  autosave(@Request() req: any, @Body() body: any) {
    return this.submissionsService.autosave(req.user.userId, body);
  }

  @Post('submit')
  submit(@Request() req: any, @Body() body: any) {
    return this.submissionsService.submit(req.user.userId, body);
  }

  @Get('portfolio')
  getPortfolio(@Request() req: any) {
    return this.submissionsService.getPortfolio(req.user.userId);
  }
}