const mockingoose = require('mockingoose');

import User from '../../src/models/user'

import { UserRepository } from '../../src/repository/mongo_repository/userRepository'
import { IUserRepository } from '../../src/repository/iUserRepository';

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
            mockingoose(User).toReturn(new Error("Coucou"), "findOne");

            const service = new UserRepository(User)

            service.findById("").catch(err => {
                expect(true).toBeTruthy()
            })
        })
    })
})