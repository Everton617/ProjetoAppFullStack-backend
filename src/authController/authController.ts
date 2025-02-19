import { Request, Response } from 'express';
import prisma from '../../prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/jwtUtils';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Senha inválida" });
      return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    const decoded: any = jwt.decode(token);  
    const expiresAt = new Date(decoded.exp * 1000);
 
    await prisma.session.deleteMany({ where: { userId: user.id } });

    
    await prisma.session.create({
      data: {
        token,        
        userId: user.id,
        expiresAt: expiresAt
      },
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};