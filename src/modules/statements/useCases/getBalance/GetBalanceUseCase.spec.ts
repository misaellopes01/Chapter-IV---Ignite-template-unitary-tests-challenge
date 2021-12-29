import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


enum OperationType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw",
}

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase

describe("Balance Statement", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase =  new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        inMemoryStatementRepository = new InMemoryStatementsRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository)
    })

    it("should be able to get user balance", async () => {
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

        const balance = await getBalanceUseCase.execute({user_id})

        expect(balance).toHaveProperty("balance")
    })
    
    it("should not be able to get the balance with a nonexisting user", async () => {    
        expect(async () => {

            await getBalanceUseCase.execute({user_id: 'Test'})

        }).rejects.toBeInstanceOf(GetBalanceError)
    })
   
})