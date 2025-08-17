import 'reflect-metadata';
import { Router } from 'express';
import '../../config/diContainers';
import { PatientController } from '../../controllers/patients/patientController';
import { container } from 'tsyringe';

const router = Router();
const patientController = container.resolve<PatientController>('PatientController');

router.post('/patients', (req, res) => patientController.createPatient(req, res));
router.put('/patients/:id', (req, res) => patientController.updatePatient(req, res));
router.get('/patients/:id', (req, res) => patientController.getPatientById(req, res));
router.get('/patients/user/:userId', (req, res) => patientController.getPatientsByUserId(req, res));

// router.delete('/patients/:id', (req, res) => patientController.deletePatient(req, res));

export default router;
