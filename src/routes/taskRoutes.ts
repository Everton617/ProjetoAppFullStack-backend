import express from 'express';
import cors from 'cors'; 

import { addTask, editTask, deleteTask, completeTask } from '../taskController/taskController';

const taskRouter = express.Router();


taskRouter.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

taskRouter.post("/tasks", addTask);
taskRouter.put("/tasks", editTask);
taskRouter.put("/tasks/complete", completeTask);
taskRouter.delete("/tasks", deleteTask);

export default taskRouter;