const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const EmployeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employeeId: {
        type: Number
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    mobile: {
        type: Number,
        unique: true,
        match: /^(\+\d{1,3}[- ]?)?\d{10}$/
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manager',
        required: true
    },
});

EmployeeSchema.plugin(AutoIncrement, {
    inc_field: 'employeeId'
});

module.exports = mongoose.model('Employee', EmployeeSchema);