const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    scores: {
        infinite: {
            score: Number,
            time: Number
        },
        normal: {
            easyTime: Number,
            normalTime: Number,
            hardTime: Number
        }
    }
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;