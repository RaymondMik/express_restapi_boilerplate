const mongoose = require('mongoose');

const RideRequestSchema = mongoose.Schema({
    userId: { type: String, required: true, minLength: 1 },
    pickUp: { type: Number, required: true }, // Decimal Degrees ex.41.40338, 2.17403
    dropOff: { type: Number, required: true }, // Decimal Degrees ex.41.40338, 2.17403
    passengers: { type: Number, required: true, default: 1,  },
    date: { type: Date, required: false, default: Date.now,  },
    status: { type: String, required: false, default: 'open' }
});

module.exports.RideRequestSchema = RideRequestSchema;
