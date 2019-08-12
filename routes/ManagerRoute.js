const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const managerController = require('../controllers/ManagerController');
const {
    check
} = require('express-validator');

router.post('/signup', [
    check('email').isEmail().withMessage('invalid email'),
    check('password').matches(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/).withMessage('invalid password'),
    check('firstName').not().isEmpty().withMessage('firstName must not be empty'),
    check('lastName').not().isEmpty().withMessage('lastName must not be empty'),
    check('dob').not().isEmpty().withMessage('dob must not be empty'),
    check('company').not().isEmpty().withMessage('company must not be empty')
], managerController.signup);

router.post('/login', [
    check('email').isEmail().withMessage('invalid email'),
    check('password').matches(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/).withMessage('Invalid Password')
], managerController.login);

router.post('/employees', checkAuth, [
    check('firstName').not().isEmpty().withMessage('firstName must not be empty'),
    check('lastName').not().isEmpty().withMessage('lastName must not be empty'),
    check('mobile').isLength({
        min: 10,
        max: 10
    }).withMessage('Mobile must be 10 digits'),
    check('dob').not().isEmpty().withMessage('dob must not be empty'),
    check('address').not().isEmpty().withMessage('address must not be empty')
], managerController.addNewEmployee);

router.get('/employees', checkAuth, managerController.showEmployees);

router.put('/employees/:id', checkAuth, [
    check('firstName').not().isEmpty().withMessage('firstName must not be empty'),
    check('lastName').not().isEmpty().withMessage('lastName must not be empty'),
    check('mobile').isLength({
        min: 10,
        max: 10
    }).withMessage('Mobile must be 10 digits'),
    check('dob').not().isEmpty().withMessage('dob must not be empty'),
    check('address').not().isEmpty().withMessage('address must not be empty')
], managerController.updateEmployee);

router.delete('/employees/:id', checkAuth, managerController.deleteEmployee);

module.exports = router;