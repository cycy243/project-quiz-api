import mongoose, { MongooseError } from 'mongoose';
import { DataAccessError } from '../../src/errors/dataAccessError';
import Quiz, { IQuiz } from '../../src/models/quiz';
import QuizRepository from '../../src/repository/mongo_repository/quizRepository';

import IQuestion from '../../src/models/question';

describe("QuizRepositoryTests", () => {

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

      describe('Repository "mask" database error',() => {
        it("When an error related to data validation occured in mongoose then wrap throw DataAccessError", async () => {
          const _doc: any = {
            title: 'name',
            questions: Array<IQuestion>(0)
          };
      
          const service = new QuizRepository()

          try {
            await service.insert(_doc as IQuiz)
            expect(false).toBeTruthy()
          } catch(error) {
            const result = error instanceof DataAccessError;
            
            expect(result).toBeTruthy()
          }
        })
        
        it("When an error related to mongoose is thrown doesn't expose it to other layer", async () => {
          const _doc: IQuiz = {
            title: 'name',
            description: "dhfkhdhldhfldhf",
            questions: []
          };

          const methodSave = Quiz.prototype.save
          Quiz.prototype.save = jest.fn().mockImplementationOnce(() => {
            throw new MongooseError("Simulated save error");
          });
      
          const service = new QuizRepository()

          try {
            await service.insert(_doc)
            expect(false).toBeTruthy()
          } catch(error) {
            const result = error instanceof DataAccessError;
            
            expect(result).toBeTruthy()
          }
          Quiz.prototype.save = methodSave
        })
      })

      describe("search quiz", () => {
        it("When search by title and title exist then return every item with title like the given one", async ()=> {
          // Arrange
          const _doc: IQuiz = {
            title: 'Test title',
            description: 'Test description',
            questions: []
          };
      
          const service = new QuizRepository()
          await service.insert(_doc);
          await service.insert({ ..._doc, title: "Coucou title" });
          await new Promise((r) => setTimeout(r, 2000));

          // Act
          const searchResults = await service.search({ title: "title" })
          
          // Assert
          expect(searchResults).toHaveLength(2)
        })
        
        it("When search by title and title doesn't exist then return empty arry", async ()=> {
          // Arrange
          const _doc: IQuiz = {
            title: 'Test title',
            description: 'Test description',
            questions: []
          };
      
          const service = new QuizRepository()
          await service.insert(_doc);
          await service.insert({ ..._doc, title: "Coucou title" });
          await new Promise((r) => setTimeout(r, 2000));

          // Act
          const searchResults = await service.search({ title: "tété" })
          
          // Assert
          expect(searchResults).toHaveLength(0)
        })
      })
    })
})