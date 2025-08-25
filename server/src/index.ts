import express from 'express'
import 'reflect-metadata';
import './config/diContainers'; 
import authRoutes from './routes/users/auth';
import profileRoutes from './routes/users/profileRoutes';
import cors from 'cors'
import dotenv from 'dotenv'
import doctorProfileRoutes from './routes/doctors/profileRoutes'
import DoctorAuthRoutes from './routes/doctors/authRoutes'
import AdminAuthRoutes from './routes/admin/adminAuth';
import UserMgtRoutes from './routes/admin/userMgtRoutes';
import PatientRoutes from './routes/patients/patientRoutes';
import DoctorMgtRoutes from './routes/admin/doctorMgtRoutes';
import cookieParser from "cookie-parser";

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT 

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    }) 
)

app.use('/api/auth', authRoutes);
app.use('/api/',profileRoutes);
app.use('/api/doctor',doctorProfileRoutes);
app.use('/api/doctor/auth',DoctorAuthRoutes);
app.use('/api/admin/auth',AdminAuthRoutes);
app.use('/api/admin/user-mgt',UserMgtRoutes);
app.use('/api/patients',PatientRoutes);
app.use('/api/admin/doctor-mgt',DoctorMgtRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`)
})
   