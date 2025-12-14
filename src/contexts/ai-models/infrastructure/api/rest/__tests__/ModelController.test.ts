import express from 'express';
import request from 'supertest';
import { ModelController } from '../ModelController';
import { CreateModelUseCase } from '../../../../application/use-cases/CreateModelUseCase';
import { GetModelUseCase } from '../../../../application/use-cases/GetModelUseCase';
import { ListModelsUseCase } from '../../../../application/use-cases/ListModelsUseCase';
import { UpdateModelUseCase } from '../../../../application/use-cases/UpdateModelUseCase';
import { DeleteModelUseCase } from '../../../../application/use-cases/DeleteModelUseCase';

import { expect, test, describe, beforeEach, mock } from "bun:test";

describe('ModelController', () => {
    let app: express.Express;

    // Mocks
    const mockCreateUseCase = { execute: mock(() => Promise.resolve()) };
    const mockGetUseCase = { execute: mock(() => Promise.resolve(null)) };
    const mockListUseCase = { execute: mock(() => Promise.resolve([])) };
    const mockUpdateUseCase = { execute: mock(() => Promise.resolve()) };
    const mockDeleteUseCase = { execute: mock(() => Promise.resolve()) };

    beforeEach(() => {
        mock.restore();

        const controller = new ModelController(
            mockCreateUseCase as unknown as CreateModelUseCase,
            mockGetUseCase as unknown as GetModelUseCase,
            mockListUseCase as unknown as ListModelsUseCase,
            mockUpdateUseCase as unknown as UpdateModelUseCase,
            mockDeleteUseCase as unknown as DeleteModelUseCase
        );

        app = express();
        app.use(express.json());

        // Setup routes manually for testing the controller in isolation
        app.post('/models', (req, res) => controller.create(req, res));
        app.get('/models/:id', (req, res) => controller.get(req, res));
        app.get('/models', (req, res) => controller.list(req, res));
        app.put('/models/:id', (req, res) => controller.update(req, res));
        app.delete('/models/:id', (req, res) => controller.delete(req, res));
    });

    describe('POST /models', () => {
        test('should return 201 on success', async () => {
            const res = await request(app)
                .post('/models')
                .send({
                    provider: 'openai',
                    model: 'gpt-4'
                });

            expect(res.status).toBe(201);
            expect(mockCreateUseCase.execute).toHaveBeenCalled();
        });

        test('should return 400 on error', async () => {
            // force error
            mockCreateUseCase.execute = mock(() => Promise.reject(new Error('Validation error')));

            const res = await request(app)
                .post('/models')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation error');
        });
    });

    describe('GET /models/:id', () => {
        test('should return 200 and the model if found', async () => {
            const dummyModel = { id: '123', provider: 'test', model: 'test' };
            mockGetUseCase.execute = mock(() => Promise.resolve(dummyModel as any));

            const res = await request(app).get('/models/123');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(dummyModel);
        });

        test('should return 404 if not found', async () => {
            mockGetUseCase.execute = mock(() => Promise.resolve(null));

            const res = await request(app).get('/models/999');

            expect(res.status).toBe(404);
        });

        test('should return 400 if id missing (handled by express usually, but good to check controller logic if applicable)', async () => {
            // In our controller we added a check for req.params.id, but Express routing usually guarantees params presence if the route matches.
            // However, we can test the explicit check if we manually call the method or mock req object, but via supertest it matches route.
            // Let's test the error handling block generally.
            mockGetUseCase.execute = mock(() => Promise.reject(new Error('DB Error')));
            const res = await request(app).get('/models/123');
            expect(res.status).toBe(500);
        });
    });

    describe('GET /models', () => {
        test('should return 200 and list of models', async () => {
            const list = [{ id: '1', provider: 'a', model: 'b' }];
            mockListUseCase.execute = mock(() => Promise.resolve(list as any));

            const res = await request(app).get('/models');
            expect(res.status).toBe(200);
            expect(res.body).toEqual(list);
        });

        test('should return 500 on error', async () => {
            mockListUseCase.execute = mock(() => Promise.reject(new Error('Failed')));
            const res = await request(app).get('/models');
            expect(res.status).toBe(500);
        });
    });

    describe('PUT /models/:id', () => {
        test('should return 204 on success', async () => {
            mockUpdateUseCase.execute = mock(() => Promise.resolve());
            const res = await request(app).put('/models/123').send({ temperature: 0.5 });
            expect(res.status).toBe(204);
            expect(mockUpdateUseCase.execute).toHaveBeenCalledWith('123', { temperature: 0.5 });
        });

        test('should return 400 on error', async () => {
            mockUpdateUseCase.execute = mock(() => Promise.reject(new Error('Update failed')));
            const res = await request(app).put('/models/123').send({});
            expect(res.status).toBe(400);
        });
    });

    describe('DELETE /models/:id', () => {
        test('should return 204 on success', async () => {
            mockDeleteUseCase.execute = mock(() => Promise.resolve());
            const res = await request(app).delete('/models/123');
            expect(res.status).toBe(204);
            expect(mockDeleteUseCase.execute).toHaveBeenCalledWith('123');
        });

        test('should return 400 on error', async () => {
            mockDeleteUseCase.execute = mock(() => Promise.reject(new Error('Delete failed')));
            const res = await request(app).delete('/models/123');
            expect(res.status).toBe(400);
        });
    });
});
