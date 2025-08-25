import { Router } from 'express'
import { container } from 'tsyringe'
import { AdminDoctorMgtController } from '../../controllers/admin/doctorMgtController'
import { upload } from '../../config/multer'
import authenticateAdmin from '../../middleware/authenticateAdmin'
const router = Router()
const doctorMgtController = container.resolve<AdminDoctorMgtController>('AdminDoctorMgtController')

router.post('/doctor', upload.single('profileImage'), authenticateAdmin, (req, res) => doctorMgtController.createDoctor(req, res))
router.put('/doctor/:id', upload.single('profileImage'), authenticateAdmin, (req, res) => doctorMgtController.updateDoctor(req, res))
// router.patch('/doctor/:id/block', (req, res) => doctorMgtController.blockDoctor(req, res))
// router.patch('/doctor/:id/unblock', (req, res) => doctorMgtController.unblockDoctor(req, res))
router.get('/doctors', authenticateAdmin, (req, res) => doctorMgtController.getAllDoctors(req, res))
router.get('/doctor/:id', authenticateAdmin, (req, res) => doctorMgtController.getDoctorById(req, res))
// router.get('/doctor', (req, res) => doctorMgtController.getDoctorByEmail(req, res))

export default router
