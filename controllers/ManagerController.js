const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const manager = require('../models/ManagerModel');
const employee = require('../models/EmployeeModel');
const {
    validationResult
} = require('express-validator');
const config = require('../config.json');

exports.signup = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }

    manager.find({
            email: req.body.email
        })
        .exec()
        .then(response => {
            if (response.length > 0) {
                res.status(409).json({
                    errorMessage: 'email already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const managerUser = new manager({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            dob: req.body.dob,
                            company: req.body.company
                        });
                        managerUser.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "manager data saved",
                                    firstName: result.firstName,
                                    lastName: result.lastName,
                                    email: result.email,
                                    dob: result.dob,
                                    company: result.company
                                });
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        })
}


exports.login = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }

    var token;
    manager.find({
            email: req.body.email
        })
        .exec()
        .then(result => {
            if (result.length != 1) {
                res.status(401).json({
                    errorMessage: 'Auth failed, please check your email and password'
                });
            }
            bcrypt.compare(req.body.password, result[0].password, (err, success) => {
                if (!success) {
                    res.status(401).json({
                        errorMessage: 'Auth failed, please check your email and password'
                    });
                }
                if (success) {
                    token = jwt.sign({
                            email: result[0].email,
                            userId: result[0]._id
                        },
                        config.env.JWT_KEY, {
                            expiresIn: "10h"
                        }
                    );
                    res.status(200).json({
                        message: 'login success',
                        _id: result[0]._id,
                        firstName: result[0].firstName,
                        lastName: result[0].lastName,
                        email: result[0].email,
                        dob: result[0].dob,
                        company: result[0].company,
                        jwt: token
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                errorMessage: 'Auth failed, please check your email and password'
            });
        });
}

exports.addNewEmployee = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }

    employeeUser = new employee({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobile: req.body.mobile,
        address: req.body.address,
        dob: req.body.dob,
        manager: req.body.manager
    });
    employeeUser.save()
        .then(result => {
            res.status(201).json({
                message: "new employee added",
                employeeDetails: result
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unable to add employee",
                error: err
            });
        });
}

exports.showEmployees = (req, res) => {

    employee.find()
        .exec()
        .then(result => {
            res.status(200).json({
                employees: result
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unable to fetch employee data",
                error: err
            });
        });
}

exports.updateEmployee = (req, res) => {

    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
        return res.status(422).json({
            errors: errorsList.array()
        });
    }
    const updatedEmployee = req.body;
    employee.update({
            _id: req.params.id
        }, updatedEmployee)
        .then(result => {
            res.status(200).json({
                message: "employee data updated successfully",
                updatedEmployee: result
            });
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: "unale to update employee data",
                error: err
            })
        });
}

exports.deleteEmployee = (req, res) => {

    employee.findOneAndDelete({
            _id: req.params.id
        })
        .then(result => {
            (result == null ? res.status(403).json({
                message: "employee not exists in database",
            }) : res.status(202).json({
                message: "employee data deleted",
            }));
        })
        .catch(err => {
            res.status(500).json({
                errorMessage: err
            })
        });
}