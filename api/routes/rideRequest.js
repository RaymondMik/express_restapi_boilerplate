const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const {mongoose} = require('../../database/mongoose.js');
const {RideRequest} = require('../../database/models/rideRequest.js');
const {validateId} = require('../../utilities');

// GET ALL RIDE REQUESTS route
router.get('/', (req, res) => {
    RideRequest.find()
        .then((requests) => {
            res.send({requests});
        }).catch( (error) => {
            res.status(400).send(error);
        });
});

// GET SINGLE RIDE REQUEST route
router.get('/:id', (req, res) => {
    validateId(req.params.id, 400);

    RideRequest.findById(req.params.id)
        .then((rideRequest) => {
            if (!rideRequest) return res.status(404).send('rideRequest not found');

            res.send(rideRequest);
        }).catch((e) => {
            res.status(500).send(`The following error ${e} occured while fetching data`);
        });  
});

// POST RIDE REQUEST route
router.post('/', (req, res) => {
    const newRideRequest = new RideRequest({
        userId: req.body.userId,
        pickUp: req.body.pickUp,
        dropOff: req.body.dropOff,
        passengers: req.body.passengers,
        date: req.body.date
    });

    newRideRequest.save().then((doc) => {
        res.status(200).send(doc)
    }, (error) => {
        res.status(400).send(error);
    });
});

// DELETE SINGLE RIDE REQUEST route
router.delete('/:id', (req, res) => {
    validateId(req.params.id, 400);

    RideRequest.findByIdAndRemove(req.params.id)
        .then((result) => {
            if (!result) return res.status(404).send('RideRequest not found');

            res.status(200).send(result);
        }).catch((e) => {
            return res.status(500).send('There was an error while deleting RideRequest');
        });
});

// UPDATE SINGLE RIDE REQUEST route
router.patch('/:id', (req, res) => {
    validateId(req.params.id, 400);

    const body = {status: req.body.status};

    if (typeof body.status !== 'string') {
        return res.status(400).send(`The paramater 'status' should be either 'open', 'accepted', 'rejected', 'cancelled', 'closed'`);
    }

    RideRequest.findByIdAndUpdate(req.params.id, {$set: body}, {new: true, runValidators: true})
        .then( (rideRequest) => { 
            if (!rideRequest) return res.status(404).send();

            return res.send({rideRequest});
        }).catch( (err) => res.status(500).send('There was an error while updating RideRequest'));
});

module.exports = router;