import express from 'express';
import cors from 'cors'; 

import { getAllTasks,addTask, editTask, deleteTask, completeTask } from '../taskController/taskController';
import { authenticateUser } from '../middleware';

const taskRouter = express.Router();


taskRouter.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

taskRouter.get("/tasks", authenticateUser, getAllTasks);
taskRouter.post("/tasks", authenticateUser, addTask);
taskRouter.put("/tasks",authenticateUser, editTask);
taskRouter.put("/tasks/complete",authenticateUser, completeTask);
taskRouter.delete("/tasks",authenticateUser, deleteTask);

export default taskRouter;