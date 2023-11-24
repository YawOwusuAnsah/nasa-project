const mongooes = require('mongoose');

const planetsSchema = new mongooes.Schema({
    kepler_name: {
        type: String,
        required: true
    }
});

module.exports = mongooes.model('Planet', planetsSchema);