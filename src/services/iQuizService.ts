import QuizDto from "../dto/quizDto";

export default interface IQuizService {
    saveQuiz(quizDto: QuizDto): Promise<QuizDto>
}