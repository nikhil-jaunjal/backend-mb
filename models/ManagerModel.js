const mongoose = require('mongoose');
const ManagerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true,
        match: /[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/
    },
    dob: {
        type: Date
    },
    company: {
        type: String
    }
});

module.exports = mongoose.model('Manager', ManagerSchema);