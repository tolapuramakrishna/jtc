const _ = require('underscore');
const dbService = require('../include/database');
const appConfig = require('../include/appconfig');
const utils = require('../include/utilities');
const moment = require('moment-timezone');

module.exports = () => {
    global.app.post('/v1/userregister', (req, res, next) => {
        var postObj = req.body;
        console.log('register');
        if (postObj && postObj.hasOwnProperty('userName') && postObj.hasOwnProperty('email') &&
            postObj.hasOwnProperty('password')) {
            let userName = utils.isNameValid(postObj.userName);

            if (['', undefined, 'undefined', null, 'null'].indexOf(postObj) == -1 && userName &&
                utils.isEmailValid(postObj.email) && utils.isPasswordValid(postObj.password)) {
                dbService.findDocs('users', {
                    email: postObj.email,
                    status: true
                }).then(async (userArray) => {
                    if (userArray && userArray instanceof Array && userArray.length > 0) {
                        res.status(302).send({
                            status: 0,
                            message: 'error',
                            messageText: 'User already registered!'
                        });
                    } else {
                        // *********************************************************************
                        
                        var payload = {
                            uid: await utils.getNextSequenceValue('users','JCT'),
                            userName: userName,                     
                            email: postObj.email,
                            password: await utils.generatePassphrase(postObj.password),
                            userVerified: true,
                            createdTime: moment().toDate('YYYY-MM-DD HH:mm:ss'),
                            status: true
                        }
                        var insertUser = await utils.insertDocInDb('users', payload);
                        if (insertUser) {
                            res.status(200).send({
                                status: 1,
                                message: 'success',
                                messageText: 'Registration successful!'
                            });
                        } else {
                            res.status(500).send({
                                status: 0,
                                message: 'error',
                                messageText: 'Registration failed!, Please try after some time.'
                            });
                        }
                        // *********************************************************************
                    }
                }, (error) => {
                    res.status(500).send({
                        status: 0,
                        message: 'error',
                        messageText: appConfig.errorMessages.somethingWentWrong
                    });
                });
            } else {
                if (!utils.isPasswordValid('password')) {
                    res.status(400).send({
                        status: 0,
                        message: 'error',
                        messageText: appConfig.errorMessages.invalidPassword
                    });
                } else {
                    res.status(400).send({
                        status: 0,
                        message: 'error',
                        messageText: appConfig.errorMessages.badRequest
                    });
                }
            }
        } else {          
            res.status(400).send({
                status: 0,
                message: 'error',
                messageText: appConfig.errorMessages.badRequest
            });
        }
    }, (error) => {
        res.status(500).send({
            status: 0,
            message: 'error',
            messageText: appConfig.errorMessages.somethingWentWrong
        });
    });
};