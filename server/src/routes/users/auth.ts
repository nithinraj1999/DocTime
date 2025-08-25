import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../../controllers/users/authController';


const router = Router();
const authController = container.resolve<AuthController>('AuthController')

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.signin(req, res));
router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => authController.resendOTP(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.post('/forgot-password', (req, res) => authController.forgetPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));



  
 


export default router;
