var prefStoreServices = angular.module('prefStoreServices', []);
var EventEmitter = require('events').EventEmitter;
var util = require('util');


prefStoreServices.factory('PrefStore', ["$q", function ($q) {

    var stubData = {
        user: {
            email: "mnpetersen@gmail.com",
            name: "Michael"
        },
        syncConfig: {
            server: "",
            credentials: ""
        }
    };

    function PrefStore() {
        EventEmitter.call(this);
    };
    util.inherits(PrefStore, EventEmitter);

    PrefStore.prototype.user = function (user) {
        if (arguments.length === 0) {
            return stubData.user;
        }
        stubData.user = user;
        return stubData.user;
    };

    PrefStore.prototype.syncConfig = function (syncConfig) {
        if (arguments.length === 0) {
            return stubData.syncConfig;
        }
        stubData.syncConfig = syncConfig;
        return stubData.syncConfig;
    };

    return new PrefStore();
}]);