import express from 'express'
import 'reflect-metadata';
import './config/diContainers'; 
import authRoutes from './routes/users/auth';
import profileRoutes from './routes/users/profileRoutes';
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT 

app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/',profileRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`)
})
   