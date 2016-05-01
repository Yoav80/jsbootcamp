'use strict';

var express = require('express');
var router = express.Router();
//var DBClass = require('../bin/DB-Wrapper.js');
//var DB = new DBClass("./phonebookDB.db");


var fs = require('fs');
var DATA_PATH = './dataDB.txt';


router.get('/flatJSON' , function (req, res, next) {
    console.log("getting all items ");
    if (!fs.existsSync(DATA_PATH))
    {
        console.log("no data file");
        res.set('Content-Type', 'application/json');
        res.send('error while retrieving rows, please contact your administrator.');
    }
    else {

        fs.readFile(DATA_PATH, function (err, data) {
            console.log(err , data);
            if (err) {
                res.set('Content-Type', 'text/plain');
                res.send('error while retrieving rows, please contact your administrator.');
            }
            else {
                res.set('Content-Type', 'text/plain');
                res.send(data);
            }
        });

    }
});

router.post('/flatJSON' , function (req, res, next) {
    if(!req.body) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }
    var data = req.body;
    console.log("writing data to file" , data);

    //var dataToWrite = createFlatArr(data);
    var dataToWrite = JSON.stringify(data);

    fs.writeFile(DATA_PATH, dataToWrite , "utf8", function (err, data) {
        if (err) {
            console.log("error while saving data");
            //res.set('Content-Type', 'application/json');
            res.send("error while saving data");
        }
        else {
            console.log("data saved");
            res.send("data saved");
        }
    });

});

function createFlatArr(item, flatArray){
    var obj = {};

    if (flatArray == null) {
        flatArray = [];
    }

    if (item.type == "Group") {
        obj = {
            "type": item.type,
            "name": item.name,
            "numOfChildes": item.items.length,
            "id":item.id
        };
    }
    else{
        obj = {
            "type": item.type,
            "name": item.firstName + " " + item.lastName,
            "phoneNumbers": item.phoneNumbers,
            "id":item.id
        };
    }

    flatArray.push(obj);

    if(item.type == "Group" && item.items.length > 0){
        for(var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
            createFlatArr(item.items[subGroupsIndex],flatArray);
        }
    }

    return flatArray;
}


/* GET group listing.

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
/*
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
*/

module.exports = router;