import IQuestion from "../models/question";
import { IQuiz } from "../models/quiz";

export default interface IQuizRepository {
    insert(toAdd: IQuiz): Promise<IQuiz>

    search(args: QuizSearchArgs): Promise<Array<IQuiz>>
}

export type QuizSearchArgs = {
    title?: String
}