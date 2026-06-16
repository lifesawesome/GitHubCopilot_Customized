import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import orderDetailRouter, { resetOrderDetails } from './orderDetail';
import { orderDetails as seedOrderDetails } from '../seedData';

let app: express.Express;

describe('OrderDetail API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/order-details', orderDetailRouter);
        resetOrderDetails();
    });

    it('should create a new order detail', async () => {
        const newOrderDetail = {
            orderDetailId: 4,
            orderId: 1,
            productId: 5,
            quantity: 3,
            unitPrice: 149.99,
            notes: 'New premium bed order'
        };

        const response = await request(app).post('/order-details').send(newOrderDetail);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newOrderDetail);
    });

    it('should get all order details', async () => {
        const response = await request(app).get('/order-details');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedOrderDetails.length);
        response.body.forEach((orderDetail: any, index: number) => {
            expect(orderDetail).toMatchObject(seedOrderDetails[index]);
        });
    });

    it('should get an order detail by ID', async () => {
        const response = await request(app).get('/order-details/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedOrderDetails[0]);
    });

    it('should update an order detail by ID', async () => {
        const updatedOrderDetail = {
            ...seedOrderDetails[0],
            quantity: 10
        };

        const response = await request(app).put('/order-details/1').send(updatedOrderDetail);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedOrderDetail);
    });

    it('should delete an order detail by ID', async () => {
        const response = await request(app).delete('/order-details/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing order detail', async () => {
        const response = await request(app).get('/order-details/999');
        expect(response.status).toBe(404);
    });

    it('should return 400 for invalid order detail payload on create', async () => {
        const response = await request(app).post('/order-details').send({
            orderDetailId: 4,
            orderId: 1,
            productId: 5,
            quantity: 'three',
            unitPrice: 149.99
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid order detail payload' });
    });

    it('should return 400 for invalid order detail payload on update', async () => {
        const response = await request(app).put('/order-details/1').send({
            ...seedOrderDetails[0],
            unitPrice: 'free'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid order detail payload' });
    });
});
