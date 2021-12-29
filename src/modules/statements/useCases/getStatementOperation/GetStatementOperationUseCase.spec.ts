import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

describe("Statement Operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase =  new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        inMemoryStatementRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
    })

    it("should be able to get user statement operation balance", async () => {
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

        const { id } = await createStatementUseCase.execute({
            user_id,
            amount: 111500,
            description: 'Website',
            type: "deposit" as OperationType
        })

        const statement = await getStatementOperationUseCase.execute({user_id, statement_id: id})

        expect(statement.type).toEqual('deposit')
    })
    
    it("should not be able to get the statement with a nonexisting user or statement", async () => {    
        expect(async () => {

            await getStatementOperationUseCase.execute({user_id: 'Test', statement_id: 'Test'})

        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound || GetStatementOperationError.StatementNotFound)
    })
   
})