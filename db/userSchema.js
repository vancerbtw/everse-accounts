const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    "_id": String,
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    profilePicture: {
        type: String
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

var Oauth = mongoose.model('oauthdb', UserSchema, 'oauthdb');

module.exports = Oauth