import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
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
            name: "TailWag Auto Toy",
            description: "AI-powered interactive toy that adapts to cat play styles",
            price: 39.99,
            sku: "CAT-TOY-001",
            unit: "piece",
            imgName: "tailwag.png"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedProducts.length);
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
            name: 'Updated SmartFeeder One'
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
    });

    it('should return 404 when updating a non-existing product', async () => {
        const response = await request(app).put('/products/999').send(seedProducts[0]);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting a non-existing product', async () => {
        const response = await request(app).delete('/products/999');
        expect(response.status).toBe(404);
    });
});
