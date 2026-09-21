import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  private questions = [
    { id: 1, text: 'I enjoy making things look beautiful and visually appealing', track: 'Frontend Web Development' },
    { id: 2, text: 'I love solving puzzles and working with data', track: 'Backend Development' },
    { id: 3, text: 'I like understanding how users think and behave', track: 'UX/UI Design' },
    { id: 4, text: 'I enjoy building things that work behind the scenes', track: 'Backend Development' },
    { id: 5, text: 'I am interested in making apps for phones', track: 'Mobile App Development' },
  ];

  getQuestions() {
    return this.questions;
  }

  async submitQuiz(userId: string, answers: any[]) {
    const tracks = await this.prisma.careerTrack.findMany();
    let chosenTrackName = 'Frontend Web Development';
    for(const ans of answers) {
      const agreed = ans.agreed || ans.agree || (ans.value && ans.value >= 3);
      if(agreed) {
        const q = this.questions.find(x => x.id === ans.questionId);
        if(q) { chosenTrackName = q.track; break; }
      }
    }
    
    let chosenTrack = tracks.find(t => t.name === chosenTrackName) || tracks[0];
    
    const quizResponse = await this.prisma.quizResponse.create({
      data: {
        userId,
        answers: JSON.stringify(answers),
        careerTrackId: chosenTrack.id,
      }
    });

    await this.prisma.userRoadmap.create({
      data: {
        userId,
        careerTrackId: chosenTrack.id,
      }
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { quizCompleted: true }
    });

    return { result: chosenTrack };
  }
}