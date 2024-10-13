const mockingoose = require('mockingoose');

import { MongooseError } from 'mongoose';
import { DataAccessError } from '../../src/errors/dataAccessError';
import Quiz, { IQuiz } from '../../src/models/quiz';
import QuizRepository from '../../src/repository/mongo_repository/quizRepository';

import { dbConnect, dbDisconnect } from '../utils/dbHandlerUtils'
import IQuestion from '../../src/models/question';

describe("QuizRepositoryTests", () => {

  beforeAll(async () => await dbConnect(), 20000);
  afterAll(async () => {
    dbDisconnect()
  });

  beforeEach(() => {
      mockingoose.resetAll();
    });

    describe("Insert quiz test", () => {
      it("When doc is added then return it and its id", async () => {
          const _doc: IQuiz = {
            title: 'name',
            description: 'name@email.com',
            questions:[]
          };
      
          const service = new QuizRepository()
          const result = await service.insert(_doc);

          expect(result?.title).toBe(_doc.title);
          expect(result?.id).toBeDefined();
          expect(result.id instanceof String).toBeTruthy()
      })
      
      it("When quiz is added with question then return them in the created quiz", async () => {
        const questionDoc: IQuestion = {
          anwsers: [ "Yes", "No" ],
          correctAnswerIndex: 1,
          question: "Test question"
        }
        const _doc: IQuiz = {
          title: 'name',
          description: 'name@email.com',
          questions: [ questionDoc ]
        };
    
        const service = new QuizRepository()
        const result = await service.insert(_doc);

        expect(result?.questions).toHaveLength(1);
        const question = result.questions[0]
        expect(question.anwsers).toHaveLength(questionDoc.anwsers.length);
        expect(question.correctAnswerIndex).toBe(questionDoc.correctAnswerIndex);
        expect(question.question).toBe(questionDoc.question);
    })

      it("When an error related to mongoose is thrown doesn't expose it to other layer", async () => {
          const _doc: IQuiz = {
            title: 'name',
            description: 'name@email.com',
            questions:[]
          };
        
          mockingoose.Quiz.toReturn(new MongooseError(""), "save")
      
          const service = new QuizRepository()

          try {
            await service.insert(_doc)
            expect(false).toBeTruthy()
          } catch(error) {
            console.log(error);
            
            const result = error instanceof DataAccessError;
            
            expect(result).toBeTruthy()
          }
      })
    })
})