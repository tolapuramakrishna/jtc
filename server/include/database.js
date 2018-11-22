'use strict';
const appConfig = require('./appconfig');
const q = require('q');
const monk = require('monk')(appConfig.databaseConfig.url);
module.exports = {
    findDocs: function(collectionName, query, options) {

        var _self = this;
        var deferred = q.defer();

        try {

            monk.get(collectionName).find(query, options, function(err, eventRes) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(eventRes);
                }
            });

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    },

    insertDoc: function(collectionName, documents) {

        var _self = this;
        var deferred = q.defer();

        try {

            monk.get(collectionName).insert(documents, function(err, eventRes) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(eventRes);
                }
            });

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    },
    updateDoc: function(collectionName, query, data, Options) {
        var _self = this;
        var deferred = q.defer();

        try {

            monk.get(collectionName).update(query, data, Options, function(err, eventRes) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(eventRes);
                }
            });

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    },

};