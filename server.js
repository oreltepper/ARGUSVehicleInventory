//require express module
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


//create the storage object using constructor function, contains empty array of items and an id to track
var Storage = function() {
    this.items = [];
    this.id = 1;
};

Storage.prototype.findLocationOfItem= function (id){
  var pos= -1;
  console.log(this.items);
  for (var i=0 ; i<this.items.length;i++){
      if ( this.items[i].id == id ) {
        pos=i;
      }
  }
  console.log(pos);
  return pos;
}

Storage.prototype.CheckIfExists = function (  name  , timeA,type, typeB ) {
  var pos= -1;
  for (var i=0 ; i<this.items.length;i++){
      if ( this.items[i].name == name &&  this.items[i].timeA == timeA &&  this.items[i].type == type &&  this.items[i].typeB == typeB   ) {
        pos=i;
      }
  }
  return pos;
}

//add method, adds items to the storage object array, adds the ID # and increments
Storage.prototype.add = function( name,timeA,type, typeB ) {

      var item = {name: name,  timeA:timeA , type:type ,typeB:typeB , id: this.id};
      this.items.push(item);
      this.id += 1;
      return item;

};

//delete method, takes the ID and splices it from the items array, using ID
Storage.prototype.delete = function(id) {
        var pos= this.findLocationOfItem(id);
        if (pos!= -1 )
          return this.items.splice(pos,1);
};

//update method, changes the name of object item
Storage.prototype.update = function(id,name ,timeA , type , typeB) {
    var pos= this.findLocationOfItem(id);
    if (pos!= -1 ){
      var msg;
          console.log("in update ");
          console.log(timeA);
          //item already exists, update it
          this.items[pos].name = name;
          this.items[pos].timeA = timeA;
          this.items[pos].type = type;
          this.items[pos].typeB = typeB;

    }
    else {
        //no such item # exists, create it
        console.log("in add ");
        storage.add(name,timeA,type, typeB );

    }
    return this.items;
};

//creates a new storage object, adds a list of 3 items
var storage = new Storage();
storage.add('Alfa Romeo 75','2018-04-01T01:00', '1', '2017-01-11T02:00');
storage.add('Alpine A310','2016-06-01T01:00', '2', '2010-12-04T12:00');
storage.add('BMW 507','2012-24-01T02:00', '3', '2011-09-12T22:00');
storage.add('Cadillac Allanté','2011-11-01T03:00', '1', '2016-01-13T16:00');



// storage.add('Tomatoes');
// storage.add('Peppers');

//creates an express object called 'app'
var app = express();

//look for static content in the 'public' folder
app.use(express.static('public'));

//single route listening to /items, responds with a list of the storage object items as json
//listening to GET requests for /items
app.get('/items', function(request, response) {
    response.json(storage.items);
});

////////////////////////////////////////////////////////////////////
//adds a POST route listening to /items - POST /items ADDS an item
////////////////////////////////////////////////////////////////////
app.post('/items', jsonParser, function(request, response) {
    //if there is a POST, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }
    console.log (request.body);
    //gets the item request name, creates a new object, calls add method, sends response 201 'added'
    var name= request.body.name;
    var timeA = request.body.timeA;
    var type = request.body.type;
    var typeB = request.body.typeB;
    var item = storage.add(name,timeA,type,typeB);

    response.status(201).json(item);
});

/////////////////////////////////////////////////////////////////////////////
//adds a DELETE route listening to /items - DELETE /items/id DELETES an item
/////////////////////////////////////////////////////////////////////////////
app.delete('/items/:id', jsonParser, function(request, response) {
    //if there is a DELETE, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }

    var item = storage.delete(request.params.id);

    response.status(200).json(item);

    });

/////////////////////////////////////////////////////////////////////////////
//adds a PUT route listening to /items - PUT /items/id updates OBJ info
/////////////////////////////////////////////////////////////////////////////
// app.put('/items/:id/:name', jsonParser, function(request, response) {

  // app.put('/items/:id/:name', jsonParser, function(request, response) {

app.put('/items/:id/:name/:createTime/:strCarType/:lastConnectionTime', jsonParser, function(request, response) {
    //if there is a PUT, but no body, send a 400 error
    if (!request.body) {
        return response.sendStatus(400);
    }
    var id = request.params.id;
    var name = request.params.name;
    var timeA = request.params.createTime;
    var type = request.params.strCarType;
    var typeB = request.params.lastConnectionTime;
    //gets the item request name, creates a new object, calls add method, sends response 200 'ok'
    var item= storage.update(id,name ,timeA , type , typeB);

    response.status(200).json(item);
    });

//server listener
app.listen(3000);

//export objects for chai/mocha
exports.app = app;
exports.storage = storage;
