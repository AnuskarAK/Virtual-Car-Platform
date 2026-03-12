const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Sports', 'Sedan', 'SUV', 'Truck', 'Coupe'],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    defaultColor: {
        type: String,
        default: '#808080',
    },
    basePrice: {
        type: Number,
        default: 30000,
    },
    baseHorsepower: {
        type: Number,
        default: 300,
    },
    baseAcceleration: {
        type: Number,
        default: 4.5,
    },
    baseTopSpeed: {
        type: Number,
        default: 155,
    },
    baseHandling: {
        type: Number,
        default: 50,
    },
    availableColors: [{
        name: String,
        hex: String,
    }],
    availableWheels: [{
        name: String,
        image: String,
    }],
    availableSpoilers: [{
        name: String,
        image: String,
    }],
    availableBodyKits: [{
        name: String,
        image: String,
    }],
});

module.exports = mongoose.model('Car', carSchema);
