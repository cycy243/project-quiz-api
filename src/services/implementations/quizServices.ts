import QuizDto from "../../dto/quizDto";
import { IQuiz } from "../../models/quiz";
import IQuizRepository from "../../repository/iQuizRepository";
import IQuizService from "../iQuizService";

export default class QuizService implements IQuizService {

    constructor(private quizRepository: IQuizRepository) {}

    async saveQuiz(quiz: QuizDto): Promise<QuizDto> {
        if(quiz.id !== undefined) {
            // TODO: Update quiz
            throw new Error("Not implemented yet")
        } else {
            // TODO: Add mapper
            // TODO: map in domain object dto
            // TODO: map in dto the result
            const result = await this.quizRepository.insert({} as IQuiz)
            return {} as QuizDto
        }
    }

}