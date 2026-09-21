import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get('tracks')
  getAllTracks() {
    return this.missionsService.getAllTracks();
  }

  @Post('switch-track')
  switchTrack(@Request() req: any, @Body() body: { trackId: string }) {
    return this.missionsService.switchTrack(req.user.userId, body.trackId);
  }

  @Get()
  getMissions(@Request() req: any, @Query('trackId') trackId?: string) {
    return this.missionsService.getMissionsForUser(req.user.userId, trackId);
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