const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../../app.js');
const {RideRequest} = require('../../database/models/rideRequest.js');

const mockRideRequests = [
    {
        passengers: 3,
        status: 'closed',
        _id: new ObjectID(),
        userId: 'ioioio99',
        pickUp: 88888,
        dropOff: 9999,
        date: '2018-06-13T18:46:44.000Z'
    },
    {
        passengers: 2,
        status: 'open',
        _id: new ObjectID(),
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

// GET ride-requests
describe('GET /ride-requests route', () => {
    test('all ride requests should be returned', (done) => {
        request(app)
            .get('/ride-requests')
            .expect(200)
            .expect((res) => {
                expect(res.body.requests.length).toBe(mockRideRequests.length);
            })
            .end(done);
    });

    test('all ride requests should be an array of objects', (done) => {
        request(app)
            .get('/ride-requests')
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

// GET SINGLE ride-request
describe('GET /ride-requests/:id route', () => {
    test('get a single ride request', (done) => {
        request(app)
            .get(`/ride-requests/${mockRideRequests[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toEqual(String(mockRideRequests[0]._id));
            })
            .end(done);  
    });

    test('single ride request not found', (done) => {
        const newHexId = new ObjectID().toHexString();
        request(app)
            .get(`/ride-requests/${newHexId}`)
            .expect(404)
            .end(done);
    });

    test('invalid id passed to the request', (done) => {
        request(app)
            .get('/ride-requests/wow1234')
            .expect(400)
            .end(done);  
    });
});

// POST ride-request
describe('POST /ride-requests route', () => {
    test('Should add a new ride request', (done) => {
        const newRideRequest = {
            passengers: 1,
            status: 'open',
            userId: 'ioioio91',
            pickUp: 888884,
            dropOff: 99994
        };

        RideRequest.find().then(() => {
            request(app)
            .post('/ride-requests')
            .send(newRideRequest)
            .expect(200)
            .expect((res) => {
                for (let value in res.body) {
                    if (res.body.hasOwnProperty(value) && value !== '__v' && value !== '_id' && value !== 'date') {
                        expect(res.body[value]).toEqual(newRideRequest[value]);
                    }
                }
            })
            .end((err, res) => {
                if (err) return done(err);
                RideRequest.find(newRideRequest).then((rideRequest) => {
                    // test if rideRequest is unique
                    expect(rideRequest.length).toBe(1);
                    // test if rideRequest has been correctly inserted into db
                    expect(rideRequest[0].userId).toEqual(newRideRequest.userId);
                    done();
                }).catch((e) => done(e));
            });   
        });
    });

    test('Should NOT add a new invalid ride request', (done) => {
        const newInvalidRideRequest = {
            passengers: 'hello',
            userId: 96,
            pickUp: 888884,
            dropOff: 'hi'
        };

        RideRequest.find().then(() => {
            request(app)
            .post('/ride-requests')
            .send(newInvalidRideRequest)
            .expect(400)
            .expect((res) => {
                expect(res.body.name).toEqual('ValidationError');
            })
            .end((err, res) => {
                expect()
                if (err) return done(err);
                RideRequest.find().then((rideRequests) => {
                    expect(rideRequests.length).toBe(mockRideRequests.length);
                    done();
                }).catch((e) => done(e));
            });   
        });
    });
});

// DELETE ride request
describe('DELETE /ride-requests/:id route', () => {
    test('ride-request was deleted correctly', (done) => {
        const hexId = mockRideRequests[0]._id.toHexString();
        request(app)
            .delete(`/ride-requests/${hexId}`)
            .expect(200)
            .expect((res) => expect(res.body._id).toBe(String(mockRideRequests[0]._id))) 
            .end(((err, res) => { 
                if (err) return done(err); 
                
                RideRequest.findById(hexId).then((rideRequest) => {
                    expect(rideRequest).toBeFalsy();
                    done();
                }).catch( (e) => done(e));
            }));  

    });

    test('non existing ride-request should fire a 404 error', (done) => {
        const newHexId = new ObjectID().toHexString();
        request(app)
            .get(`/ride-requests/${newHexId}`)
            .expect(404)
            .end(done);  
    });

    test('ride-request with invalid id should fire a 400 error', (done) => {
        request(app)
            .delete(`/ride-requests/bubu1234`)
            .expect(400)
            .end(done);  
    });
});

