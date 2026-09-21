import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ParentService } from './parent.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('children')
  getChildren(@Request() req: any) {
    return this.parentService.getChildren(req.user.userId);
  }

  @Post('link')
  linkChild(@Request() req: any, @Body('studentEmail') studentEmail: string) {
    return this.parentService.linkChild(req.user.userId, studentEmail);
  }

  @Post('cheer')
  sendCheer(
    @Request() req: any,
    @Body('studentId') studentId: string,
    @Body('message') message: string,
  ) {
    return this.parentService.sendCheer(req.user.userId, studentId, message);
  }

  @Get('children/:studentId/communications')
  getChildCommunications(@Request() req: any, @Param('studentId') studentId: string) {
    return this.parentService.getChildCommunications(req.user.userId, studentId);
  }
}
