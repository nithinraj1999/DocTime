import 'reflect-metadata';
import { Router } from 'express';
import '../../config/diContainers';
import { ProfileController } from '../../controllers/users/profileController';
import { container } from 'tsyringe';
import { upload } from '../../config/multer';
import authenticateUser from '../../middleware/authenticate';
const router = Router();
const profileController = container.resolve<ProfileController>('ProfileController');

router.get('/profile/:id', authenticateUser, (req, res) => profileController.getProfile(req, res));
router.put('/profile/:id', authenticateUser, (req, res) => profileController.updateProfile(req, res));

export default router;
