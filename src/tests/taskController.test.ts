import request from 'supertest';
import { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import app from '../server';

const prisma = new PrismaClient();

describe('Task Controller', () => {
  let server: Express;

  beforeAll(() => {
    server = app;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /tasks', () => {
    it('should return all tasks for authenticated user', async () => {
      const res = await request(server)
        .get('/tasks')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(server)
        .get('/tasks');

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Usuário não autenticado.');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const res = await request(server)
        .post('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ description: 'New Task' });

      expect(res.status).toBe(201);
      expect(res.body.description).toBe('New Task');
    });

    it('should return 400 if description is missing', async () => {
      const res = await request(server)
        .post('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Descrição da tarefa é obrigatória.');
    });
  });

  describe('PUT /tasks', () => {
    it('should update a task', async () => {
      const res = await request(server)
        .put('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 1, description: 'Updated Task' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Tarefa atualizada com sucesso.');
    });

    it('should return 404 if task is not found', async () => {
      const res = await request(server)
        .put('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 999, description: 'Updated Task' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Tarefa não encontrada ou usuário não tem permissão.');
    });
  });

  describe('DELETE /tasks', () => {
    it('should delete a task', async () => {
      const res = await request(server)
        .delete('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 1 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Tarefa excluída com sucesso.');
    });

    it('should return 404 if task is not found', async () => {
      const res = await request(server)
        .delete('/tasks')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 999 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Tarefa não encontrada ou usuário não tem permissão.');
    });
  });

  describe('PATCH /tasks/toggle', () => {
    it('should toggle task completion', async () => {
      const res = await request(server)
        .patch('/tasks/toggle')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 1 });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Tarefa marcada como (concluída|pendente) com sucesso./);
    });

    it('should return 404 if task is not found', async () => {
      const res = await request(server)
        .patch('/tasks/toggle')
        .set('Authorization', 'Bearer valid-token')
        .send({ taskId: 999 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Tarefa não encontrada.');
    });
  });
});