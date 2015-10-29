/**
 * Very simple NodeJS API to illustrate the usage of angular-scaffold
 *
 * Creates an API around adding, listing and removing studios, which are angular-model
 * instances that simply have a name and an identifier.
 *
 * This API provides:
 * * A basic web server serving static assets, based from index.html
 * * A single API endpoint, /studio, with GET, POST and DELETE implemented (PUT
 *   is left as an exercise to the reader)
 *
 * This serves to demonstrate that angular-scaffold can talk to a REST-ish API.
 *
 * Install dependencies with:
 *
 *     npm install
 *
 * Start it with:
 *
 *     node server.js
 *
 * Then browse to http://localhost:4730/
 */

// acquire dependencies
var express = require('express');
var bodyParser = require('body-parser');

// Configure the Express application
var app = express();
// Use the body parser json plugin so that new studios can be created
app.use(bodyParser.json());
// serve this directory statically so users can just browse it as well as use the API
app.use(express.static('.'));


// Declare a set of studios. This is the data that the API will start with.
// Studios can be added and removed through example page index.html, although
// once you restart the server, it
var studios = [{
  "$links": {
    "self": "/api/studios/studioa"
  },
  "_id":"studioa",
  "name":"Studio A"
}, {
  "$links": {
    "self": "/api/studios/studiob"
  },
  "_id":"studiob",
  "name":"Studio B"
}];

/**
 * Go through the studios collection and find a studio where studio._id = id
 *
 * This is a very simple, naive implementation, it is not production code, it is
 * supplied solely as part of this sample API.
 *
 * @param {int} id
 * @returns angular-model instance or null
 */
function findStudioIndex(id) {
  for (var i = 0 ; i < studios.length; i++) {
    if (studios[i]._id === id) {
      return i;
    }
  }
  return null;
}

// Set up the /studios endpoint

/**
 * GET /studios will return the studios in JSON format
 */
app.get('/api/studios', function(req, res) {
  res.json(studios);
});

/**
 * POST /studios will create a new studio
 *
 * There is no error checking here. This is a naive example API only.
 */
app.post('/api/studios', function(req, res) {
  var newStudio = {
    $links: {
      self: "/studios/" + req.body._id
    },
    _id: req.body._id,
    name: req.body.name
  };

  studios.push(newStudio);
  res.json(true);
});

/**
 * DELETE /studios/id will delete the studio identified by request parameter id
 *
 * There is no error checking here. This is a naive example API only.
 */
app.delete('/api/studios/:id', function(req, res) {
  var idx = findStudioIndex(req.params.id);
  studios.splice(idx, 1);
  res.json(true);
});

// Start this example API on localhost:4730
app.listen(process.env.PORT || 4730);
