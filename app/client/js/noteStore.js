var noteStoreServices = angular.module('noteStoreServices', []);

var PouchDb = require("./vendor/pouchdb-2.2.3.min.js");
var Utils = require("./js/utils.js");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Note = function (json) {

    var content = angular.extend({
        title: "",
        markup: "",
        format: "textile",
        created: {
            by: "",
            on: null
        },
        edited: {
            by: "",
            on: ""
        },
        tags: ""

    }, json);

    if (content.id === "") {
        content.id = Utils.guid();
    }

    if (!content.created.on) {
        content.created.on = new Date();
    }

    function title() {
        if (arguments.length == 0) {
            return content.title;
        }
        content.title = arguments[0];
    }

    function markup() {
        if (arguments.length == 0) {
            return content.markup;
        }
        content.markup = arguments[0];
    }

    function format() {
        if (arguments.length == 0) {
            return content.format;
        }
        content.format = arguments[0];
    }

    function tags() {
        if (arguments.length == 0) {
            return content.tags;
        }
        content.tags = arguments[0];
    }

    function id() {
        if (arguments.length == 0) {
            return content._id;
        }
        if (!angular.isUndefined(content._id) && arguments[0] != content._id) {
            throw new Error("Cannot modify _id once assigned");
        }
        content._id = arguments[0];
    }

    function createdOn() {
        return content.created.on;
    }

    function trash() {
        content.deleted = true;
    }

    function undelete() {
        delete content.delete;
    }

    function deleted() {
        return content.deleted === true;
    }

    function data() {
        return angular.copy(content);
    }

    function revision() {
        if (arguments.length == 0) {
            return content._rev;
        }
        content._rev = arguments[0];
    }

    return {
        title: title,
        format: format,
        markup: markup,
        tags: tags,
        id: id,
        revision: revision,
        createdOn: createdOn,
        data: data,
        delete: trash,
        restore: undelete,
        deleted: deleted
    };

}

noteStoreServices.factory('NoteStore', ["$q", function ($q) {
    var db = new PouchDb("quaver");

    function NoteStore() {
        EventEmitter.call(this);
    };
    util.inherits(NoteStore, EventEmitter);

    NoteStore.prototype.saveNote = function (note) {
        var defered = $q.defer();
        var doc = note.data();
        if (angular.isUndefined(note.id())) {
            db.post(doc)
                .then(function (resp) {
                    note.id(resp.id);
                    note.revision(resp.rev);
                    defered.resolve(note);
                    this.emit("save-note", note);
                });
        }
        else {
            db.put(doc)
                .then(function (resp) {
                    note.id(resp.id);
                    note.revision(resp.rev);
                    defered.resolve(note);
                    this.emit("save-note", note);
                });
        }
        return defered.promise;
    }

    NoteStore.prototype.deleteNote = function (note) {
        note.delete();
        var self = this;
        return this.saveNote(note)
            .then(function events() {
                self.emit("delete-note", note);
            });
    }

    NoteStore.prototype.allNotes = function () {

        var defered = $q.defer();

        var live = function (doc, emit) {
            if (!doc.deleted) {
                emit(doc);
            }
        };
        db.query(live, {
                include_docs: true
            },
            function (err, response) {
                var notes = _.map(response.rows, function (row) {
                    return Note(row.doc);
                });
                defered.resolve(notes);
            });


        return defered.promise;
    }

    NoteStore.prototype.newNote = function () {
        var note = new Note({
            title: "Untitled note.",
            markup: "A new note.",
            tags: ""
        });
        this.emit("new-note", note);
        return this.saveNote(note);
    }


    return new NoteStore();
}])
;