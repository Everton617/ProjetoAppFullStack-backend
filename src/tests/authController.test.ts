import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../server';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

describe('Auth Controller', () => {
    beforeAll(async () => {
     
      await prisma.user.deleteMany({});
      await prisma.session.deleteMany({});
    });
  
    afterAll(async () => {

      await prisma.$disconnect();
    });
  
    describe('POST /signup', () => {
      it('should create a new user and return a token', async () => {
        const res = await request(app)
          .post('/signup')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          });
  
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
      });
  
      it('should return 500 if user creation fails', async () => {
   
        jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error('Database error'));
  
        const res = await request(app)
          .post('/signup')
          .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          });
  
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Erro ao criar usuário');
      });
    });
  
    describe('POST /login', () => {
      it('should login and return a token', async () => {
      
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
          },
        });
  
        const res = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'password123',
          });
  
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
      });
  
      it('should return 404 if user is not found', async () => {
        const res = await request(app)
          .post('/login')
          .send({
            email: 'nonexistent@example.com',
            password: 'password123',
          });
  
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Usuário não encontrado');
      });
  
      it('should return 401 if password is invalid', async () => {
    
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.create({
          data: {
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
          },
        });
  
        const res = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          });
  
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Senha inválida');
      });
  
      it('should return 500 if login fails', async () => {
      
        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error('Database error'));
  
        const res = await request(app)
          .post('/login')
          .send({
            email: 'test@example.com',
            password: 'password123',
          });
  
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error', 'Erro ao fazer login');
      });
    });
  });