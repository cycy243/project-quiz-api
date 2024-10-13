import * as mongoose from "mongoose"
import IQuestion from "./question"

export interface IQuiz {
    id?: String,
    title: String,
    description: String,
    questions: Array<IQuestion>
}

export const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    questions: {
        type: Array<IQuestion>, 
        required: true
    }
})

const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema)

export default Quiz