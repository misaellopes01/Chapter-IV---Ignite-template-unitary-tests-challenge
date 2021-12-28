import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to create a new user", async () => {
        const user = {
            name: 'Misael Lopes',
            email: 'mecl.ely@gmail.com',
            password: 'admin1234'
        }

        const createdUser = await createUserUseCase.execute(user);
        
        expect(createdUser).toHaveProperty("id")
    })

    it("should not be able to create a new user with nonexisting email", async () => {    
        expect(async () => {
            const user = {
                name: 'Misael Lopes',
                email: 'misael.ely@gmail.com',
                password: 'admin1234'
            }
    
            await createUserUseCase.execute(user);
            await createUserUseCase.execute(user);
            
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})