import { beforeEach, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';
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
            name: 'CatTech West HQ',
            description: 'West coast operations hub',
            address: '555 Meow Avenue',
            contactPerson: 'Daisy Purr',
            email: 'daisy@octocat.com',
            phone: '555-0002'
        };

        const response = await request(app).post('/headquarters').send(newHeadquarters);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newHeadquarters);
    });

    it('should get all headquarters', async () => {
        const response = await request(app).get('/headquarters');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(seedHeadquarters.length);
        response.body.forEach((headquarters: any, index: number) => {
            expect(headquarters).toMatchObject(seedHeadquarters[index]);
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
        expect(response.body).toEqual({ error: 'Headquarters not found' });
    });

    it('should return 400 for invalid headquarters payload on POST', async () => {
        const response = await request(app).post('/headquarters').send({
            headquartersId: 2,
            name: 'Broken HQ',
            description: 'Missing address',
            contactPerson: 'Daisy',
            email: 'not-an-email',
            phone: '555-0002'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid headquarters payload' });
    });

    it('should return 400 for invalid headquarters payload on PUT', async () => {
        const response = await request(app).put('/headquarters/1').send({
            ...seedHeadquarters[0],
            email: 'not-an-email'
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid headquarters payload' });
    });
});
