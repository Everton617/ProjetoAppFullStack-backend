import express from 'express';
import cors from 'cors'; 
import { signup, login } from '../authController/authController';


const authRoutes = express.Router();


authRoutes.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

// Rotas
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);

export default authRoutes;