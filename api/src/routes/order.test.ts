import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderRouter, { resetOrders } from './order';
import { orders as seedOrders } from '../seedData';

let app: express.Express;

describe('Order API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/orders', orderRouter);
        resetOrders();
    });

    it('should create a new order', async () => {
        const newOrder = {
            orderId: 3,
            branchId: 1,
            orderDate: new Date().toISOString(),
            name: "Summer Supply Run",
            description: "Seasonal product restock for summer",
            status: "pending"
        };
        const response = await request(app).post('/orders').send(newOrder);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newOrder);
    });

    it('should get all orders', async () => {
        const response = await request(app).get('/orders');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedOrders.length);
        response.body.forEach((order: any, index: number) => {
            expect(order).toMatchObject({
                orderId: seedOrders[index].orderId,
                branchId: seedOrders[index].branchId,
                name: seedOrders[index].name,
                status: seedOrders[index].status,
            });
        });
    });

    it('should get an order by ID', async () => {
        const response = await request(app).get('/orders/1');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            orderId: seedOrders[0].orderId,
            branchId: seedOrders[0].branchId,
            name: seedOrders[0].name,
            status: seedOrders[0].status,
        });
    });

    it('should update an order by ID', async () => {
        const updatedOrder = {
            ...seedOrders[0],
            name: 'Updated Order Name',
            status: 'processing'
        };
        const response = await request(app).put('/orders/1').send(updatedOrder);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedOrder);
    });

    it('should delete an order by ID', async () => {
        const response = await request(app).delete('/orders/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order', async () => {
        const response = await request(app).get('/orders/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 404 when updating a non-existing order', async () => {
        const response = await request(app).put('/orders/999').send({ orderId: 999 });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 404 when deleting a non-existing order', async () => {
        const response = await request(app).delete('/orders/999');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});
