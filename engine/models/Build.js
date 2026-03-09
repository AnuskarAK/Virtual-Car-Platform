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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Build', buildSchema);
