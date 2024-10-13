import QuizDto from "../../dto/quizDto";
import { IQuiz } from "../../models/quiz";
import IQuizRepository from "../../repository/iQuizRepository";
import IQuizService from "../iQuizService";
import quizMapper from '../../mapper/quizMapper'
import { DataAccessError } from "../../errors/dataAccessError";
import ServiceError from "../errors/serviceErrors";

export default class QuizService implements IQuizService {

    constructor(private quizRepository: IQuizRepository) {}

    async saveQuiz(quizDto: QuizDto): Promise<QuizDto> {
        try {
            const entity = quizMapper.toEntity(quizDto)
            let resultDto: QuizDto
            if(quizDto.id !== undefined) {
                // TODO: Update quiz
                throw new Error("Not implemented yet")
            } else {
                const insertResult = await this.quizRepository.insert(entity)
                resultDto = quizMapper.toDto(insertResult)
            }
            return resultDto
        } catch(error) {
            if(error instanceof DataAccessError) {
                throw new ServiceError("An error occured when saving the requested quiz")
            }
            throw error
        }
    }

}