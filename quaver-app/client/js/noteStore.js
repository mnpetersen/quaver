var noteStoreServices = angular.module('noteStoreServices',[]);


noteStoreServices.factory('NoteStore', ["$q",function($q){

    var stubData = [
        {
            tags: "foo bar baz",
            markdown: "",
            title: "asdfds"
        } ,
        {
            tags: "foo bar baz",
            markdown: "",
            title: "asdfdsf 22 asdf"
        }
    ];

    return {

        allTags : function() {
            var defer = $q.defer();
            var tags = _.uniq(_.flatten(_.map(stubData, function(note) {
               return note.tags.split(" ")
            })));
            setTimeout(function(){
                defer.resolve(tags);
            },100);

            return defer.promise;
        },

        allNotes : function() {
            var defer = $q.defer();

            setTimeout(function(){
                defer.resolve(stubData);
            },100);

            return defer.promise;
        }
    }
}]) ;