import { Router } from 'express';
import { container } from 'tsyringe';
import { AdminUserMgtController } from '../../controllers/admin/userMgtController';
const router = Router();
const userMgtController = container.resolve<AdminUserMgtController>('AdminUserMgtController')

router.post('/user', (req, res) => userMgtController.createUser(req, res));
router.put('/user/:id', (req, res) => userMgtController.updateUser(req, res));
router.patch('/user/:id/block', (req, res) => userMgtController.blockUser(req, res));
router.patch('/user/:id/unblock', (req, res) => userMgtController.unblockUser(req, res));
router.get('/users', (req, res) => userMgtController.getAllUsers(req, res));


export default router;
 