import mongoose, { model, MongooseError } from "mongoose";
import Quiz, { IQuiz } from "../../models/quiz";
import IQuizRepository, { QuizSearchArgs } from "../iQuizRepository";
import { MongoError } from "mongodb";
import { DataAccessError } from "../../errors/dataAccessError";



export default class QuizRepository implements IQuizRepository {
    async search(args: QuizSearchArgs): Promise<Array<IQuiz>> {
        const findResult = (await Quiz.find({ title: { $regex: args.title } }))        
        
        return findResult.map(t => ({ description: t.description, title: t.title, questions: t.questions, id: new String(t.id) }))
    }

    async insert(toAdd: IQuiz): Promise<IQuiz> {
        try {
            const quiz = new Quiz(toAdd);
            quiz.id = await quiz.save();
            return { description: quiz.description, title: quiz.title, questions: quiz.questions, id: new String(quiz.id) };
        } catch(error) {
            if(error instanceof MongooseError) {
                throw new DataAccessError({ message: "An error occured whil saving the quiz in the database" })
            }
            throw error
        }
    }
    
}