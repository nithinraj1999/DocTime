import { Router } from 'express';
import { container } from 'tsyringe';
import { DoctorAuthController } from '../../controllers/doctors/authController';

const router = Router();
const doctorAuthController = container.resolve<DoctorAuthController>('DoctorAuthController')

router.post('/login', (req, res) => doctorAuthController.signin(req, res));
router.post('/verify-otp', (req, res) => doctorAuthController.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => doctorAuthController.resendOTP(req, res));
  



export default router;
