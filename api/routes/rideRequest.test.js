const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../../app.js');
const {RideRequest} = require('../../database/models/rideRequest.js');

const mockRideRequests = [
    {
        passengers: 3,
        status: 'closed',
        _id: '5b2166a1781f603bf9c56e2a',
        userId: 'ioioio99',
        pickUp: 88888,
        dropOff: 9999,
        date: '2018-06-13T18:46:44.000Z'
    },
    {
        passengers: 2,
        status: 'open',
        _id: '5b22b4c02a1728095e2b3b83',
        userId: '6565jj',
        pickUp: 5645656465,
        dropOff: 8989899889,
        date: '2018-05-13T18:46:44.000Z'
    }
];

beforeEach((done) => {
    RideRequest.remove({}).then(() => {
        return RideRequest.insertMany(mockRideRequests);
    }).then(() => done());
});

describe('GET ALL RIDE REQUESTS route', () => {
    test('all ride requests should be returned', (done) => {
        request(app)
            .get('/ride-requests')
            .send({})
            .expect(200)
            .expect((res) => {
                expect(res.body.requests.length).toBe(mockRideRequests.length);
            })
            .end(done);
    });

    test('all ride requests should be an array of objects', (done) => {
        request(app)
            .get('/ride-requests')
            .send({})
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body.requests)).toBe(true);
                res.body.requests.forEach((value) => {
                    expect(typeof value).toBe('object');
                })
            })
            .end(done);
    });
});