const mockingoose = require('mockingoose');

import User from '../../src/models/user'

import { UserRepository } from '../../src/repository/mongo_repository/userRepository'
import { IUserRepository } from '../../src/repository/iUserRepository';
import { MongoError } from 'mongodb';
import { DataAccessError } from '../../src/errors/dataAccessError';
import { MongooseError } from 'mongoose';
import { mock } from 'ts-jest-mocker';

describe("UserRepositoryTests", () => {
    beforeEach(() => {
        mockingoose.resetAll();
      });

    describe("Insert User test", () => {
        it("When find user by with existing email then return a user", async () => {
            const _doc = {
              _id: '507f191e810c19729de860ea',
              name: 'name',
              email: 'name@email.com',
            };
        
            mockingoose(User).toReturn(_doc, "findOne");

            const service = new UserRepository(User)
            const result = await service.findBy({ email: _doc.email });

            expect(result?.email).toBe(_doc.email)
        })
        
        it("When find user by with existing pseudo then return a user", async () => {
            const _doc = {
              _id: '507f191e810c19729de860ea',
              name: 'name',
              email: 'name@email.com',
              pseudo: "coucou"
            };
        
            mockingoose(User).toReturn(_doc, "findOne");

            const service = new UserRepository(User)
            const result = await service.findBy({ pseudo: _doc.pseudo });

            expect(result?.pseudo).toBe(_doc.pseudo)
        })

        it("When user added then return a user", async () => {
            const _doc = {
              _id: '507f191e810c19729de860ea',
              name: 'name',
              email: 'name@email.com',
            };
        
            mockingoose(User).toReturn(_doc, "findOne");

            const service = new UserRepository(User)
            const result = await service.findById("");

            expect(result?.email).toBe(_doc.email)
        })

        it("When mongoose throw errors then throw custom error", () => {
            // To mock User findOne method, we just need to override it with some jest code 

            jest.mock('../../src/models/user', () => {
              return {
                  findOne: jest.fn().mockRejectedValue(new MongooseError(""))
              }
            })

            const service = new UserRepository(User)

            service.findById("").catch(err => {
                const result = err instanceof DataAccessError;
                console.log(err);
                
                console.log("error is instanceof DataAccessError: " + result);
                
                expect(result).toBeTruthy()
            })
        })
    })
})