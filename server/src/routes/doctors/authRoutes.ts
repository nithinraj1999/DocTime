import { Router } from 'express';
import { container } from 'tsyringe';
import { DoctorAuthController } from '../../controllers/doctors/authController';

const router = Router();
const doctorAuthController = container.resolve<DoctorAuthController>('DoctorAuthController')

router.post('/login', (req, res) => doctorAuthController.signin(req, res));
router.post('/verify-otp', (req, res) => doctorAuthController.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => doctorAuthController.resendOTP(req, res));
router.post('/logout', (req, res) => doctorAuthController.logout(req, res));
router.post('/forgot-password', (req, res) => doctorAuthController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => doctorAuthController.resetPassword(req, res));



  



export default router;
