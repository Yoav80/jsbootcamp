'use strict';

var express = require('express');
var router = express.Router();
var DBClass = require('../bin/DB-Wrapper.js');
var DB = new DBClass("./phonebookDB.db");


/* GET group listing. */

//get all groups
router.get('/groups', function(req, res, next) {
    console.log("getting groups");
    DB.get('groups').then( function (groups) {
        if (groups) {
            //res.set('Content-Type', 'application/json');
            res.json(groups);
        }
    }).fail( function (err) {
        console.log(err);
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write('error while retrieving groups, please contact your administrator.');
        res.end();
    });
});

//get group
router.get('/groups/:id', function(req, res, next) {
    var id = req.params.id;
    DB.loadGroup(id).then( function (item) {
        if (item){
            //res.set('Content-Type', 'application/json');
            res.json(item);
        }
    }).fail( function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while retrieving rows, please contact your administrator.');
    });
});

//add group
router.post('/groups', function(req, res, next) {

    console.log("params: ", req.body);

    if(!req.body) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var item = req.body;
    DB.createGroup(item).then( function (id) {
        if (id) {
            //res.set('Content-Type', 'application/json');
            res.json({"id": id});
        }
    }).fail(function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while creating Student, please contact your administrator.');
    })
});

//delete group
router.delete('/groups/:id', function(req, res, next) {
    var id = req.params.id;
    if (id) {
        DB.removeGroup(id).then(function (changes) {
            res.set('Content-Type', 'application/json');
            res.json({"changes":changes});
        }).fail(function (err) {
            res.set('Content-Type', 'application/json');
            res.send('error while deleting Student, please contact your administrator.');
        })
    }
});

//update group
router.put('/groups/:id', function(req, res, next) {
    if(!req.body) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var id = req.params.id;
    var item = req.body;
    DB.updateGroup(item , id).then( function (changes) {
        if (changes) {
            res.set('Content-Type', 'application/json');
            res.json({"changes":changes});
        }
        else {
            res.send("no  changes");
        }
    }).fail(function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while creating Student, please contact your administrator.');
    })
});



/* GET contact listing */

//get all contacts
router.get('/contacts', function(req, res, next) {
    console.log("getting groups");
    DB.get('contacts').then( function (contacts) {
        if (contacts) {
            //res.set('Content-Type', 'application/json');
            res.json(contacts);
        }
    }).fail( function (err) {
        console.log(err);
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write('error while retrieving groups, please contact your administrator.');
        res.end();
    });
});

//get contact
router.get('/contacts/:id', function(req, res, next) {
    var id = req.params.id;
    DB.loadContact(id).then( function (item) {
        if (item){
            //res.set('Content-Type', 'application/json');
            res.json(item);
        }
    }).fail( function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while retrieving rows, please contact your administrator.');
    });
});

//add contact
router.post('/contacts', function(req, res, next) {

    console.log("params: ", req.body);

    if(!req.body) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var item = req.body;
    DB.createContact(item).then( function (id) {
        if (id) {
            //res.set('Content-Type', 'application/json');
            res.json({"id": id});
        }
    }).fail(function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while creating Student, please contact your administrator.');
    })
});

//delete contact
router.delete('/contacts/:id', function(req, res, next) {
    var id = req.params.id;
    if (id) {
        DB.removeContact(id).then(function (changes) {
            res.set('Content-Type', 'application/json');
            res.json({"changes":changes});
        }).fail(function (err) {
            res.set('Content-Type', 'application/json');
            res.send('error while deleting Student, please contact your administrator.');
        })
    }
});

//update contact
router.put('/contacts/:id', function(req, res, next) {
    if(!req.body) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var id = req.params.id;
    var item = req.body;
    DB.updateContact(item , id).then( function (changes) {
        if (changes) {
            res.set('Content-Type', 'application/json');
            res.json({"changes":changes});
        }
        else {
            res.send("no  changes");
        }
    }).fail(function (err) {
        res.set('Content-Type', 'application/json');
        res.send('error while creating Student, please contact your administrator.');
    })
});


module.exports = router;