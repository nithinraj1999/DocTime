import express from 'express'
import 'reflect-metadata';
import './config/diContainers'; 
import authRoutes from './routes/patients/auth';

import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT 

app.use(cors())

app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`)
})
   