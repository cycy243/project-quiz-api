import QuizDto from "../dto/quizDto";

export default interface IQuizService {
    saveQuiz(quiz: QuizDto): Promise<QuizDto>
}