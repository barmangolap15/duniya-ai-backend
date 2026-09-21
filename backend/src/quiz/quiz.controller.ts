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
  submitQuiz(@Request() req: any, @Body('answers') answers: any[]) {
    return this.quizService.submitQuiz(req.user.userId, answers);
  }
}