import { rejects } from "assert";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase =  new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to authenticate an user", async () => {
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

        expect(authenticatedUser).toHaveProperty("token")
    })

    it("should not be able to authenticate a nonexisting user", async () => {    
        expect(async () => {
            const user = {
                name: 'Misael Lopes',
                email: 'misael.ely@gmail.com',
                password: 'admin1234'
            }
    
            await authenticateUserUseCase.execute({
                email: user.email,
                password: user.password
            });  
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})