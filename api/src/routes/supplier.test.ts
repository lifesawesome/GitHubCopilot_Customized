import { beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import supplierRouter, { resetSuppliers } from './supplier';
import { suppliers as seedSuppliers } from '../seedData';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
        resetSuppliers();
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 4,
            name: 'Purrfect Supplies',
            description: 'Premium cat-themed merchandising',
            contactPerson: 'Milo Whisker',
            email: 'milo@purrfect.com',
            phone: '555-0104'
        };

        const response = await request(app).post('/suppliers').send(newSupplier);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedSuppliers.length);
        response.body.forEach((supplier: any, index: number) => {
            expect(supplier).toMatchObject(seedSuppliers[index]);
        });
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedSuppliers[0]);
    });

    it('should update a supplier by ID', async () => {
        const updatedSupplier = {
            ...seedSuppliers[0],
            name: 'Updated PurrTech'
        };

        const response = await request(app).put('/suppliers/1').send(updatedSupplier);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedSupplier);
    });

    it('should delete a supplier by ID', async () => {
        const response = await request(app).delete('/suppliers/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Supplier not found' });
    });

    it('should return 400 for invalid supplier payload on POST', async () => {
        const response = await request(app).post('/suppliers').send({
            supplierId: 4,
            name: 'Broken Supplier',
            description: 'Invalid email',
            contactPerson: 'Milo',
            email: 'not-an-email',
            phone: '555-0104'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid supplier payload' });
    });

    it('should return 400 for invalid supplier payload on PUT', async () => {
        const response = await request(app).put('/suppliers/1').send({
            ...seedSuppliers[0],
            email: 'not-an-email'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid supplier payload' });
    });
});
