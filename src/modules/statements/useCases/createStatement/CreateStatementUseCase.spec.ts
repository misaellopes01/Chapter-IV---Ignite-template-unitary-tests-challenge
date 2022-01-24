import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
}

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementRepository: InMemoryStatementsRepository

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase =  new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        inMemoryStatementRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
    })

    it("should be able to make a new statement", async () => {
        const user = {
            name: 'Misael Lopes',
            email: 'mecl.ely@gmail.com',
            password: 'admin1234'
        }
        
        await createUserUseCase.execute(user)

        const authenticatedUser = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        const user_id = authenticatedUser.user.id

        const statementCreated = await createStatementUseCase.execute({
            user_id,
            amount: 111500,
            description: 'Website',
            type: "deposit" as OperationType
        })

        expect(statementCreated).toHaveProperty("id")
    })

    it("should not be able to create a statement with a nonexisting user", async () => {    
        expect(async () => {

            await createStatementUseCase.execute({
                user_id: 'Test',
                amount: 111500,
                description: 'Website',
                type: "deposit" as OperationType
            })

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })


    it("should not be able to make a withdraw with non-sufficient balance", async () => {    
        expect(async () => {

            const user = {
                name: 'Misael Lopes',
                email: 'mecl.ely@gmail.com',
                password: 'admin1234'
            }
            
            await createUserUseCase.execute(user)
    
            const authenticatedUser = await authenticateUserUseCase.execute({
                email: user.email,
                password: user.password
            });
    
            const user_id = authenticatedUser.user.id

            await createStatementUseCase.execute({
                user_id,
                amount: 11500,
                description: 'Website',
                type: "deposit" as OperationType
            })

            await createStatementUseCase.execute({
                user_id,
                amount: 12500,
                description: 'Website',
                type: "withdraw" as OperationType
            })

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })
   
   
    
})