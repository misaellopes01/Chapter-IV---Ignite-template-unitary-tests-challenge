import { Router } from 'express';

import { GetBalanceController } from '../modules/statements/useCases/getBalance/GetBalanceController';
import { GetStatementOperationController } from '../modules/statements/useCases/getStatementOperation/GetStatementOperationController';
import { CreateStatementController } from '../modules/statements/useCases/createStatement/CreateStatementController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';
import { CreateTransferController } from '../modules/statements/useCases/createTransfer/CreateTransferController';


const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const createTransferController = new CreateTransferController();

statementRouter.use(ensureAuthenticated);

statementRouter.get('/balance', getBalanceController.execute);
statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);
statementRouter.post('/transfer/:receiver_id', createTransferController.handle)

export { statementRouter };
