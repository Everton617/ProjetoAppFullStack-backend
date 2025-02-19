import express from 'express';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { isSessionActive } from './middleware';

const app = express();

// Middleware para processar JSON no corpo da requisição
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

app.use('/api', taskRoutes);


app.get("/check-session", isSessionActive);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});