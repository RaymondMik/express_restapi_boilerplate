const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const {mongoose} = require('../../database/mongoose.js');
const {RideRequest} = require('../../database/models/rideRequest.js');
const {validateId} = require('../../utilities');

// GET ALL RIDEREQUESTS route
router.get('/', (req, res) => {
    RideRequest.find().then((requests) => {
        res.send({requests});
    }).catch( (error) => {
        res.status(400).send(error);
    });
});

// GET SINGLE RIDEREQUEST route
router.get('/:id', (req, res) => {
    validateId(req.params.id);

    RideRequest.findById(req.params.id).then((rideRequest) => {
        if (!rideRequest) return res.status(404).send('rideRequest not found');

        res.send(rideRequest);
    }).catch((e) => {
        res.status(500).send(`The following error ${e} occured while fetching data`);
    });  
});

// POST RIDEREQUEST route
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

// DELETE SINGLE RIDEREQUEST route

// UPDATE SINGLE RIDEREQUEST route

module.exports = router;
