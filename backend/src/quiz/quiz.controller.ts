import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  getQuestions() {
    return this.quizService.getQuestions();
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit')
  submitQuiz(@Request() req: any, @Body() body: any) {
    const answers = Array.isArray(body)
      ? body
      : Array.isArray(body?.answers)
      ? body.answers
      : [];
    return this.quizService.submitQuiz(req.user.userId, answers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommendation')
  getLatestRecommendation(@Request() req: any) {
    return this.quizService.getLatestRecommendation(req.user.userId);
  }
}