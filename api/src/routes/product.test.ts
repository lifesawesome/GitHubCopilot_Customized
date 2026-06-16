import { beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
import productRouter, { resetProducts } from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        resetProducts();
    });

    it('should create a new product', async () => {
        const newProduct = {
            productId: 13,
            supplierId: 1,
            name: 'Whisker Widget',
            description: 'A smart accessory for curious cats',
            price: 49.99,
            sku: 'CAT-WIDGET-001',
            unit: 'piece',
            imgName: 'widget.png'
        };

        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedProducts.length);
        response.body.forEach((product: any, index: number) => {
            expect(product).toMatchObject(seedProducts[index]);
        });
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedProducts[0]);
    });

    it('should update a product by ID', async () => {
        const updatedProduct = {
            ...seedProducts[0],
            name: 'Updated SmartFeeder'
        };

        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedProduct);
    });

    it('should delete a product by ID', async () => {
        const response = await request(app).delete('/products/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Product not found' });
    });

    it('should return 400 for invalid product payload on POST', async () => {
        const response = await request(app).post('/products').send({
            productId: 13,
            supplierId: 1,
            name: 'Broken Product',
            description: 'Missing required fields',
            price: 'free',
            sku: 'CAT-BROKEN-001',
            unit: 'piece',
            imgName: 'broken.png'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid product payload' });
    });

    it('should return 400 for invalid product payload on PUT', async () => {
        const response = await request(app).put('/products/1').send({
            ...seedProducts[0],
            price: 'free'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid product payload' });
    });
});
