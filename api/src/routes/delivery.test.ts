import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import deliveryRouter, { resetDeliveries } from './delivery';
import { deliveries as seedDeliveries } from '../seedData';

let app: express.Express;

describe('Delivery API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/deliveries', deliveryRouter);
        resetDeliveries();
    });

    it('should create a new delivery', async () => {
        const newDelivery = {
            deliveryId: 3,
            supplierId: 3,
            deliveryDate: '2026-06-23T10:00:00.000Z',
            name: 'CatNip Supply Drop',
            description: 'Eco-friendly cat toys delivery',
            status: 'pending'
        };

        const response = await request(app).post('/deliveries').send(newDelivery);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newDelivery);
    });

    it('should get all deliveries', async () => {
        const response = await request(app).get('/deliveries');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedDeliveries.length);
        response.body.forEach((delivery: any, index: number) => {
            expect(delivery).toMatchObject(seedDeliveries[index]);
        });
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedDeliveries[0]);
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            ...seedDeliveries[0],
            name: 'Updated Smart Home Bundle'
        };

        const response = await request(app).put('/deliveries/1').send(updatedDelivery);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedDelivery);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 400 for invalid delivery payload on create', async () => {
        const invalidDelivery = {
            deliveryId: 3,
            supplierId: 3,
            deliveryDate: '2026-06-23T10:00:00.000Z',
            name: 'CatNip Supply Drop',
            description: 'Eco-friendly cat toys delivery',
            status: 'unknown'
        };

        const response = await request(app).post('/deliveries').send(invalidDelivery);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid delivery payload' });
    });

    it('should return 400 for invalid delivery payload on update', async () => {
        const invalidDelivery = {
            ...seedDeliveries[0],
            status: 'unknown'
        };

        const response = await request(app).put('/deliveries/1').send(invalidDelivery);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid delivery payload' });
    });

    it('should return 404 for non-existing delivery', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
    });
});
