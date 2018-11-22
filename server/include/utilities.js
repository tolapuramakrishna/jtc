const _ = require('underscore');
const dbService = require('./database');
const appConfig = require('./appconfig');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const UAParser = require('ua-parser-js');
var rp = require('async-request');
module.exports = {

    isEmailValid: (email) => {
        try {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        } catch (err) {
            return false;
        }
    },
    

    isPasswordValid: (pass) => {
        try {
            var re = /^[a-zA-Z0-9@\#\$\&\* ]*$/   
            //  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            return re.test(pass);
        } catch (err) {
            return false;
        }
    },

    updateValueInDb: (collectionName, query, update, options) => {
        options = options ? options : {};
        dbService.findOneAndSetDoc(collectionName, query, update, options).catch(error => { console.log(error) });
    },
    insertDocInDb: async(collectionName, payload) => {
        var docInserted = await dbService.insertDoc(collectionName, payload).catch(error => { return false; });
        if (docInserted && typeof docInserted === 'object') {
            return true;
        } else {
            return false;
        }
    },
    consoleLog: (...args) => {
        if (process.env.NODE_ENV == 'development') {
            console.log(...args);
        }
    },
    getNextSequenceValue: async(sequenceName,type) => {
        var sequenceDocument = await dbService.findOneAndUpdateDoc('counters', { collection: sequenceName }, { $inc: { sequence_value: 1 } }, { new: true }).catch(error => {
            return type + moment().unix();
        });
        if (sequenceDocument && typeof sequenceDocument === 'object') {
            var year = moment().year();
            return sequenceDocument.type + year + sequenceDocument.sequence_value;
        } else {
            return type + moment().unix();
        }
    },
    generatePassphrase: async(passphrase) => {
        var salt = bcrypt.genSaltSync(appConfig.passwordsaltRounds);
        var pass = await bcrypt.hashSync(passphrase, salt);
        return pass;
    },
    comparePassphrase: async(passphrase, hash) => {
        // hash is from DB
        return bcrypt.compareSync(passphrase, hash);;
    },
  
};