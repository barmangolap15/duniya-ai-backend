import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  getMissions(@Request() req: any) {
    return this.missionsService.getMissionsForUser(req.user.userId);
  }

  @Get(':id')
  getMissionDetail(@Param('id') id: string) {
    return this.missionsService.getMissionDetail(id);
  }

  @Get(':id/submission')
  getMissionSubmission(@Request() req: any, @Param('id') missionId: string) {
    return this.missionsService.getMissionSubmission(req.user.userId, missionId);
  }
}