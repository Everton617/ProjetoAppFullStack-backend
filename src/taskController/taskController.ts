import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware";

const prisma = new PrismaClient();


export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas.", error });
  }
};


export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;
    const userId = req.userId;

    if (!userId || !description) {
      res.status(400).json({ message: "Descrição da tarefa é obrigatória." });
      return;
    }

    const task = await prisma.task.create({
      data: {
        description,
        done: false,
        createdAt: new Date(),
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tarefa.", error });
  }
};


export const editTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId, description } = req.body;
    const userId = req.userId;

    if (!userId || !taskId) {
      res.status(400).json({ message: "ID da tarefa é obrigatório." });
      return;
    }

    const task = await prisma.task.updateMany({
      where: { id: taskId, userId },
      data: { description },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarefa não encontrada ou usuário não tem permissão." });
      return;
    }

    res.status(200).json({ message: "Tarefa atualizada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar tarefa.", error });
  }
};


export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.body;
    const userId = req.userId;

    if (!userId || !taskId) {
      res.status(400).json({ message: "ID da tarefa é obrigatório." });
      return;
    }

    const task = await prisma.task.deleteMany({
      where: { id: taskId, userId },
    });

    if (task.count === 0) {
      res.status(404).json({ message: "Tarefa não encontrada ou usuário não tem permissão." });
      return;
    }

    res.status(200).json({ message: "Tarefa excluída com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir tarefa.", error });
  }
};


export const toggleComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.body;
    const userId = req.userId;

    if (!userId || !taskId) {
       res.status(400).json({ message: "ID da tarefa é obrigatório." });
       return
      }

   
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
       res.status(404).json({ message: "Tarefa não encontrada." });
       return
      }

    
    const newDoneStatus = !task.done;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { 
        done: newDoneStatus,
        concludedAt: newDoneStatus ? new Date() : null, 
      },
    });

    res.status(200).json({ message: `Tarefa marcada como ${updatedTask.done ? "concluída" : "pendente"} com sucesso.` });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar status da tarefa.", error });
  }
};

