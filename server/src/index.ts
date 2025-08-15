import express from 'express'
import 'reflect-metadata';
import './config/diContainers'; 
import authRoutes from './routes/users/auth';
import profileRoutes from './routes/users/profileRoutes';
import cors from 'cors'
import dotenv from 'dotenv'
import doctorProfileRoutes from './routes/doctors/profileRoutes'
dotenv.config()

const app = express()
app.use(express.json())

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


app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`)
})
   