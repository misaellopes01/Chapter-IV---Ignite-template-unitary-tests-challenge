import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { CreateTransferError } from "./CreateTransferError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}
@injectable()
class CreateTransferUseCase {
   
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, receiver_id, amount, description }: ICreateTransferDTO ) {
    const userSender = await this.usersRepository.findById(sender_id);

    if(!userSender) {
      throw new CreateTransferError.SenderNotFound();
    }
    const receiverUser = await this.usersRepository.findById(receiver_id)

    if(!receiverUser) {
        throw new CreateTransferError.ReceiverNotFound();
    }

    const userSenderAmount = await this.statementsRepository.getUserBalance({user_id: sender_id, with_statement: false})

    if (amount > userSenderAmount.balance) {
        throw new CreateTransferError.InsufficientFunds()
    }

    await this.statementsRepository.create({
        user_id: sender_id,
        sender_id: sender_id,
        amount,
        description,
        type: OperationType.WITHDRAW
    })
    const transferOperation = await this.statementsRepository.create({
        user_id: receiverUser.id,
        sender_id: userSender.id,
        amount,
        description,
        type: OperationType.TRANSFER
    })
  
    return transferOperation;
  }
}

export { CreateTransferUseCase }