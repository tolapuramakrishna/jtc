const _ = require('underscore');
const dbService = require('../include/database');
const appConfig = require('../include/appconfig');
const utils = require('../include/utilities');
const moment = require('moment-timezone');

module.exports = () => {
    global.app.post('/v1/login', (req, res, next) => {
        var postObj = req.body;

        if (postObj && postObj.hasOwnProperty('email') && postObj.hasOwnProperty('password')) {


            if (['', undefined, 'undefined', null, 'null'].indexOf(postObj) == -1 && utils.isEmailValid(postObj.email) && utils.isPasswordValid(postObj.password)) {

                
                dbService.findDocs('users', {
                    email: postObj.email,
                }).then(async (userArray) => {
                    if (userArray && userArray instanceof Array && userArray.length > 0) {
                        let passFlag = await utils.comparePassphrase(postObj.password, userArray[0].password);
                        if (passFlag) {
                            res.status(200).send({
                                status: 1,
                                message: 'sucess',
                                messageText: 'successfully logged in',
                                data: userArray
                            });

                        } else {
                            res.status(401).send({
                                status: 0,
                                message: 'error',
                                messageText: appConfig.errorMessages.invalidPassword,

                            });
                        }
                    } else {
                        // *********************************************************************
                        res.status(401).send({
                            status: 1,
                            message: 'error',
                            messageText: 'Please register Yourself!'
                        });

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