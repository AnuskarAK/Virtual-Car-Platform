const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please name your build'],
        trim: true,
    },
    modifications: {
        paintColor: {
            type: String,
            default: '#808080',
        },
        wheels: {
            type: String,
            default: 'stock',
        },
        spoiler: {
            type: String,
            default: 'none',
        },
        bodyKit: {
            type: String,
            default: 'stock',
        },
        headlights: {
            type: String,
            default: 'stock',
        },
        taillights: {
            type: String,
            default: 'stock',
        },
    },
    totalCost: {
        type: Number,
        default: 0,
    },
    performance: {
        horsepower: { type: Number, default: 0 },
        acceleration: { type: Number, default: 0 },
        topSpeed: { type: Number, default: 0 },
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        date: { type: Date, default: Date.now },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Build', buildSchema);
