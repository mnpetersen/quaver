var noteStoreServices = angular.module('noteStoreServices', []);

var PouchDb = require("./vendor/pouchdb-2.2.3.min.js");
var Utils = require("./js/utils.js");
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var moment = require("./vendor/moment/moment.js");

var Note = function (json) {

    "use strict";

    var content = angular.extend({
        title: "",
        markup: "",
        format: "1",
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
        if (arguments.length === 0) {
            return content.title;
        }
        content.title = arguments[0];
    }

    function markup() {
        if (arguments.length === 0) {
            return content.markup;
        }
        content.markup = arguments[0];
    }

    function format() {
        if (arguments.length === 0) {
            return content.format;
        }
        content.format = arguments[0];
    }

    function tags() {
        if (arguments.length === 0) {
            return content.tags;
        }
        content.tags = arguments[0];
    }

    function id() {
        if (arguments.length === 0) {
            return content._id;
        }
        if (!angular.isUndefined(content._id) && arguments[0] != content._id) {
            throw new Error("Cannot modify _id once assigned");
        }
        content._id = arguments[0];
    }

    function createdOn() {
        return moment(content.created.on);
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
        if (arguments.length === 0) {
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
    var db = new PouchDb("http://127.0.0.1:5984/quaver");

    function NoteStore() {
        EventEmitter.call(this);
    };
    util.inherits(NoteStore, EventEmitter);

    NoteStore.prototype.notebooks = function () {
        var def = $q.defer();
        def.resolve([
            {id: "1", name: "Work"},
            {id: "2", name: "Home"}
        ]);
        return def.promise;
    }

    NoteStore.prototype.saveNote = function (note, triggerEvent) {
        triggerEvent = triggerEvent || true;
        var self = this;
        var defered = $q.defer();
        var doc = note.data();

        function onSave(resp) {
            note.id(resp.id);
            note.revision(resp.rev);
            defered.resolve(note);
            if (triggerEvent) {
                self.emit("save-note", note);
            }
        }

        if (angular.isUndefined(note.id())) {
            db.post(doc).then(onSave);
        }
        else {
            db.put(doc).then(onSave);
        }
        return defered.promise;
    }

    NoteStore.prototype.deleteNote = function (note) {
        note.delete();
        var self = this;
        return this.saveNote(note, false)
            .then(function events() {
                self.emit("delete-note", note);
            });
    }

    NoteStore.prototype.allNotes = function () {

        var defered = $q.defer();

        var live = function (doc) {
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

        return this.saveNote(note, false).then(function () {
            this.emit("new-note", note);
        });
    }


    return new NoteStore();
}])
;