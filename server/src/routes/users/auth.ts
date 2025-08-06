import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../../controllers/users/authController';


const router = Router();
const authController = container.resolve<AuthController>('AuthController')

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/signin', (req, res) => authController.signin(req, res));
router.post('/verify', (req, res) => authController.verifyOtp(req, res));



export default router;
