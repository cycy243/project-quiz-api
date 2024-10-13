import IQuestion from "../models/question";
import { IQuiz } from "../models/quiz";

export default interface IQuizRepository {
    insert(toAdd: IQuiz): Promise<IQuiz>
}