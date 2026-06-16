import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import headquartersRouter, { resetHeadquarters } from './headquarters';
import { headquarters as seedHeadquarters } from '../seedData';

let app: express.Express;

describe('Headquarters API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/headquarters', headquartersRouter);
        resetHeadquarters();
    });

    it('should create a new headquarters', async () => {
        const newHeadquarters = {
            headquartersId: 2,
            name: "PurrTech Regional HQ",
            description: "Regional feline tech headquarters",
            address: "456 Meow Street, Purrington",
            contactPerson: "Felix Clawson",
            email: "felix@purrtech.com",
            phone: "555-0002"
        };
        const response = await request(app).post('/headquarters').send(newHeadquarters);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newHeadquarters);
    });

    it('should get all headquarters', async () => {
        const response = await request(app).get('/headquarters');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedHeadquarters.length);
        response.body.forEach((hq: any, index: number) => {
            expect(hq).toMatchObject(seedHeadquarters[index]);
        });
    });

    it('should get a headquarters by ID', async () => {
        const response = await request(app).get('/headquarters/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(seedHeadquarters[0]);
    });

    it('should update a headquarters by ID', async () => {
        const updatedHeadquarters = {
            ...seedHeadquarters[0],
            name: 'Updated CatTech Global HQ'
        };
        const response = await request(app).put('/headquarters/1').send(updatedHeadquarters);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedHeadquarters);
    });

    it('should delete a headquarters by ID', async () => {
        const response = await request(app).delete('/headquarters/1');
        expect(response.status).toBe(204);
    });

    it('should return 404 for non-existing headquarters', async () => {
        const response = await request(app).get('/headquarters/999');
        expect(response.status).toBe(404);
    });

    it('should return 404 when updating a non-existing headquarters', async () => {
        const response = await request(app).put('/headquarters/999').send(seedHeadquarters[0]);
        expect(response.status).toBe(404);
    });

    it('should return 404 when deleting a non-existing headquarters', async () => {
        const response = await request(app).delete('/headquarters/999');
        expect(response.status).toBe(404);
    });
});
