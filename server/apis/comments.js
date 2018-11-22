const _ = require('underscore');
const dbService = require('../include/database');
const appConfig = require('../include/appconfig');
const utils = require('../include/utilities');
const moment = require('moment-timezone');

module.exports = () => {

    /** post comment */
    global.app.post('/v1/comment', (req, res, next) => {
        var postObj = req.body;
        if (postObj && postObj.hasOwnProperty('comment') && postObj.hasOwnProperty('uid')) {
            if (['', undefined, 'undefined', null, 'null'].indexOf(postObj) == -1 && (postObj.comment) && (postObj.uid)) {

                // *********************************************************************
                let cmntFlag = utils.getNextSequenceValue('comments', 'CM').then(async (cid) => {
                    var payload = {
                        commentId: cid,
                        comment: postObj.comment,
                        postedUid: postObj.uid,
                        upVoteCount: 0,
                        upVoteduid: [],
                        createdTime: moment().toDate('YYYY-MM-DD HH:mm:ss'),
                        status: true
                    }
                    var insertCommnet = await utils.insertDocInDb('comments', payload);
                    if (insertCommnet) {
                        res.status(200).send({
                            status: 1,
                            message: 'success',
                            messageText: 'Posted successful!'
                        });
                    } else {
                        res.status(503).send({
                            status: 1,
                            message: 'error',
                            messageText: 'Post failed!, Please try after some time.'
                        });
                    }

                })

            } else {
                res.status(400).send({
                    status: 0,
                    message: 'error',
                    messageText: appConfig.errorMessages.invalidInputs
                });

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

    /** update comment */
    global.app.put('/v1/upvote', (req, res, next) => {
        var postObj = req.body;
        if (postObj && postObj.hasOwnProperty('commentId') && postObj.hasOwnProperty('uid')) {
            if (['', undefined, 'undefined', null, 'null'].indexOf(postObj) == -1 && (postObj.commentId) && (postObj.commentId)) {

                // *********************************************************************
                let query = {
                    "commentId": postObj.commentId,
                    "upVoteduid": {
                        "$ne": postObj.uid
                    }
                };
                let data = {
                    "$inc": {
                        "upVoteCount": 1
                    },
                    "$push": {
                        "upVoteduid": postObj.uid
                    }
                }
                dbService.updateDoc('comments', query, data).then(async (response) => {
                    
                    res.status(201).send({
                        status: 1,
                        message: 'success',
                        messageText: 'Posted successful!'
                    });
                }).catch(async (err) => {
                    
                    res.status(500).send({
                        status: 0,
                        message: 'error',
                        messageText: appConfig.errorMessages.somethingWentWrong
                    });
                })

            } else {
                res.status(400).send({
                    status: 0,
                    message: 'error',
                    messageText: appConfig.errorMessages.invalidInputs
                });

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


    /** get comment */
    global.app.get('/v1/comments', (req, res, next) => {

        dbService.findDocs('comments', {}).then(async (response) => {
            res.status(200).send({
                status: 1,
                message: 'success',
                messageText: 'Posted successful!',
                data: response
            });
        }).catch(async (err) => {
            res.status(500).send({
                status: 0,
                message: 'error',
                messageText: appConfig.errorMessages.somethingWentWrong
            });
        })



    }, (error) => {
        res.status(500).send({
            status: 0,
            message: 'error',
            messageText: appConfig.errorMessages.somethingWentWrong
        });
    });
};