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
            deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            name: "CatNip Creations Bundle",
            description: "Eco-friendly cat toys and accessories delivery",
            status: "pending"
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
            expect(delivery).toMatchObject({ deliveryId: seedDeliveries[index].deliveryId, name: seedDeliveries[index].name });
        });
    });

    it('should get a delivery by ID', async () => {
        const response = await request(app).get('/deliveries/1');
        expect(response.status).toBe(200);
        expect(response.body.deliveryId).toBe(seedDeliveries[0].deliveryId);
        expect(response.body.name).toBe(seedDeliveries[0].name);
    });

    it('should update a delivery by ID', async () => {
        const updatedDelivery = {
            ...seedDeliveries[0],
            name: 'Updated PurrTech Smart Home Bundle'
        };
        const response = await request(app).put('/deliveries/1').send(updatedDelivery);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedDelivery.name);
    });

    it('should delete a delivery by ID', async () => {
        const response = await request(app).delete('/deliveries/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing delivery', async () => {
        const response = await request(app).get('/deliveries/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating a non-existing delivery', async () => {
        const response = await request(app).put('/deliveries/999').send(seedDeliveries[0]);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting a non-existing delivery', async () => {
        const response = await request(app).delete('/deliveries/999');
        expect(response.status).toBe(404);
    });
});
