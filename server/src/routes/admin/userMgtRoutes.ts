import { Router } from 'express';
import { container } from 'tsyringe';
import { AdminUserMgtController } from '../../controllers/admin/userMgtController';
import authenticateAdmin from '../../middleware/authenticateAdmin';
import { upload } from '../../config/multer';
const router = Router();
const userMgtController = container.resolve<AdminUserMgtController>('AdminUserMgtController')

router.post('/user',upload.single("profileImage"),authenticateAdmin, (req, res) => userMgtController.createUser(req, res));
router.put('/user/:id',upload.single("profileImage"), authenticateAdmin,(req, res) => userMgtController.updateUser(req, res));
router.patch('/user/:id/block', authenticateAdmin, (req, res) => userMgtController.blockUser(req, res));
router.patch('/user/:id/unblock', authenticateAdmin, (req, res) => userMgtController.unblockUser(req, res));
router.get('/users', authenticateAdmin, (req, res) => userMgtController.getAllUsers(req, res));


export default router;
 