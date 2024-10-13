import { Mock, mock } from "ts-jest-mocker"
import IQuizRepository from "../../src/repository/iQuizRepository"
import QuizService from "../../src/services/implementations/quizServices"
import { DataAccessError } from "../../src/errors/dataAccessError"
import ServiceError from "../../src/services/errors/serviceErrors"
import Quiz from "../../src/models/quiz"

describe("QuizServiceTests", () => {
    let _mockedQuizRepository: Mock<IQuizRepository>
    let _quizService: QuizService
    
    beforeEach(() => {
        // Arrange
        _mockedQuizRepository = mock<IQuizRepository>()
        _quizService = new QuizService(_mockedQuizRepository)
    })

    it("when repo insert has successfully ended then return dto with id defined this time", async () => {
        // Arrange
        const resultId = "123456789abcdefgh"
        _mockedQuizRepository.insert.mockResolvedValue({ id: resultId, description: "I am a test description", title: "Test title", questions: [] })
        // Act
        const result = await _quizService.saveQuiz({ id: undefined, description: "I am a test description", title: "Test title" })
        // Assert
        expect(result.id).toBeDefined()
        expect(result.id).toBe(resultId)
    })

    it("when repo throws error then service catch it and throws its owns", async () => {
        // Arrange
        const resultId = "123456789abcdefgh"
        _mockedQuizRepository.insert.mockRejectedValue(new DataAccessError({ message: "" }))
        try {
            // Act
            const result = await _quizService.saveQuiz({ id: undefined, description: "I am a test description", title: "Test title" })
            expect(false).toBeTruthy()
        } catch(error) {
            expect(error instanceof ServiceError).toBeTruthy()
        }
    })

    it("when repo throws error then service catch it and throws its owns", async () => {
        // Arrange
        const resultId = "123456789abcdefgh"
        _mockedQuizRepository.insert.mockRejectedValue(new DataAccessError({ message: "" }))
        try {
            // Act
            const result = await _quizService.saveQuiz({ id: undefined, description: "I am a test description", title: "Test title" })
            expect(false).toBeTruthy()
        } catch(error) {
            expect(error instanceof ServiceError).toBeTruthy()
        }
    })

    it("When quiz with same title already exist for the user then throw error", () => {
        expect(false).toBeTruthy()
    })
})