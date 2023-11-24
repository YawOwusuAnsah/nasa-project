const mongooes = require('mongoose');

const launchesSchema = new mongooes.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String
    },
    customers: [ String ],
    upcoming: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongooes.model('Launch', launchesSchema);