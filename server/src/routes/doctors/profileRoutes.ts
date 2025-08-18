import 'reflect-metadata';
import { Router } from 'express';
import '../../config/diContainers';
import { DoctorProfileController } from '../../controllers/doctors/profileController';

import { container } from 'tsyringe';


const router = Router();
const profileController = container.resolve<DoctorProfileController>('DoctorProfileController');



router.post('/profile', (req, res) => profileController.createDoctorProfile(req, res));
router.put('/profile/:id', (req, res) => profileController.updateDoctorProfile(req, res));
router.get('/profile/:id', (req, res) => profileController.getDoctorProfile(req, res)); 


export default router;
 