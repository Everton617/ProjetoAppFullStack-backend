import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "./utils/jwtUtils";
import prisma from '../prisma/client';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido ou inválido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    
    const session = await prisma.session.findUnique({
      where: { userId: decoded.userId, token },
    });

    if (!session) {
      res.status(401).json({ error: "Sessão inválida ou expirada" });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

export const isSessionActive = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido ou inválido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    
    const session = await prisma.session.findUnique({
      where: { userId: decoded.userId, token },
    });

    if (!session) {
      res.status(401).json({ error: "Sessão inválida ou expirada" });
      return;
    }

    res.status(200).json({ message: "Sessão ativa" });
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};