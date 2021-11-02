import { Router } from 'express';
import BoardController from '../boards/boards.controller';
import verifyUser from '../middlewares/verifyUser';
import getUserInfoFromToken from '../middlewares/getUserInfoFromToken';

const router = Router();
const controller = new BoardController();

router.get('/', controller.readAll);
router.get('/:board_id', getUserInfoFromToken, controller.readOne);
router.post('/', verifyUser, controller.create);
router.patch('/:board_id', verifyUser, controller.update);
router.delete('/:board_id', verifyUser, controller.delete);

export default router;
