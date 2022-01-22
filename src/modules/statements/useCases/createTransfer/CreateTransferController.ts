import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
    async handle(request: Request, response: Response) {

        const { id: sender_id } = request.user
        const { receiver_id } = request.params
        const { amount, description } = request.body

        const createTransferUseCase = container.resolve(CreateTransferUseCase)

        const transfer = await createTransferUseCase.execute({
            sender_id,
            receiver_id,
            amount,
            description
        })

        return response.status(201).json(transfer)
    }
}

export { CreateTransferController }