const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData()
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app).get('/v1/launches');
            expect(response.statusCode).toBe(200);
        });
    });
    
    describe('Test POST /v1/launches', () => {
    
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'January 4, 2028'
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
            launchDate: 'Hello'
        };
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-442 b',
        };
    
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
        
            const requestDate = Date(completeLaunchData.launchDate).valueOf();
            const responseDate = Date(response.body.launchDate).valueOf();
            expect(requestDate).toBe(responseDate);
            
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property'
            });
        });
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
        });
    });
});

