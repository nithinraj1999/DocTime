import { Router } from 'express';
import { container } from 'tsyringe';
import { AdminAuthController } from '../../controllers/admin/adminAuthController';

const router = Router();
const adminAuthController = container.resolve<AdminAuthController>('AdminAuthController')

router.post('/login', (req, res) => adminAuthController.signin(req, res));

export default router;
