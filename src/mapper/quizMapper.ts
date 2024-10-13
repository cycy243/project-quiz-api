import QuizDto from "../dto/quizDto"
import { IQuiz } from "../models/quiz"

function toDto(quiz: IQuiz): QuizDto {
    if(!quiz.title) {
        throw new Error("Title should have a value")
    }
    if(!quiz.id) {
        throw new Error("id should have a value")
    }
    if(!quiz.description) {
        throw new Error("description should have a value")
    }
    return {
        id: quiz.id,
        description: quiz.description,
        title: quiz.title
    }
}

function toEntity(quiz: QuizDto): IQuiz {
    if(!quiz.title) {
        throw new Error("Title should have a value")
    }
    if(!quiz.description) {
        throw new Error("description should have a value")
    }
    return {
        id: quiz.id,
        description: quiz.description!!,
        title: quiz.title!!,
        questions: []
    }
}

export default { toDto, toEntity }