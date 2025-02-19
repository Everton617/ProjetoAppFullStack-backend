import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const addTask = async (req: Request, res: Response) => {
  try {
    const { email, description } = req.body;

    if (!email || !description) {
      res.status(400).json({ message: "Email e descrição são obrigatórios." });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    const task = await prisma.task.create({
      data: {
        description,
        done: false,
        createdAt: new Date(),
        userId: user.id,
      },
    });

    res.status(201).json(task);
    return;
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tarefa.", error });
    return
  }
}


export const editTask = async (req: Request, res: Response) => {
  try {
    const { email, taskId, description, done } = req.body;

    if (!email || !taskId) {
      res.status(400).json({ message: "Email e ID da tarefa são obrigatórios." });
      return
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return
    }

    const task = await prisma.task.updateMany({
      where: { id: taskId, userId: user.id },
      data: { description, done, concludedAt: done ? new Date() : null },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarefa não encontrada ou usuário não tem permissão." });
      return
    }

    res.status(200).json({ message: "Tarefa atualizada com sucesso." });
    return
  } catch (error) {
     res.status(500).json({ message: "Erro ao atualizar tarefa.", error });
     return
    }
}


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { email, taskId } = req.body;

    if (!email || !taskId) {
       res.status(400).json({ message: "Email e ID da tarefa são obrigatórios." });
       return
      }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
       res.status(404).json({ message: "Usuário não encontrado." });
       return
      }

    const task = await prisma.task.deleteMany({
      where: { id: taskId, userId: user.id },
    });

    if (task.count === 0) {
       res.status(404).json({ message: "Tarefa não encontrada ou usuário não tem permissão." });
       return
      }

     res.status(200).json({ message: "Tarefa excluída com sucesso." });
     return
    } catch (error) {
     res.status(500).json({ message: "Erro ao excluir tarefa.", error });
     return
    }
}

export const completeTask = async (req: Request, res: Response) => {
  try {
    const { email, taskId } = req.body;

    if (!email || !taskId) {
      res.status(400).json({ message: "Email e ID da tarefa são obrigatórios." });
      return;
    }

  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    
    const task = await prisma.task.updateMany({
      where: { id: taskId, userId: user.id, done: false },
      data: { done: true, concludedAt: new Date() },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarefa não encontrada ou já está concluída." });
      return;
    }

    res.status(200).json({ message: "Tarefa marcada como concluída com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao concluir tarefa.", error });
  }
};


