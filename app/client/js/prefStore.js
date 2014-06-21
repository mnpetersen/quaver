var noteStoreServices = angular.module('prefStoreServices',[]);


noteStoreServices.factory('PrefStore', ["$q",function($q){

    var stubData = {
        user : {
            email : "mnpetersen@gmail.com",
            name : "Michael"
        },
        sync : {
            server : "",
            credentials:""
        }
    }

    return {

        user : function(){
            return stubData.user;
        }

    }
}]) ;