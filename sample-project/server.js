/**
 * Very simple NodeJS API to illustrate the usage of angular-scaffold
 *
 * Creates an API around adding, listing and removing posts, which are angular-model
 * instances that simply have a name and an identifier.
 *
 * This API provides:
 * * A basic web server serving static assets, based from index.html
 * * A single API endpoint, /post, with GET, POST and DELETE implemented (PUT
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
// Use the body parser json plugin so that new posts can be created
app.use(bodyParser.json());
// serve this directory statically so users can just browse it as well as use the API
app.use(express.static('.'));


// Declare a set of posts. This is the data that the API will start with.
// Posts can be added and removed through example page index.html, although
// once you restart the server, it
var posts = [{
  "$links": {
    "self": "/api/posts/posta"
  },
  "_id":"posta",
  "name":"Post A",
  "body":"Body for post A, it's just some text you know"
}, {
  "$links": {
    "self": "/api/posts/postb"
  },
  "_id":"postb",
  "name":"Post B",
  "body":"Body for post B"
}];

/**
 * Go through the posts collection and find a post where post._id = id
 *
 * This is a very simple, naive implementation, it is not production code, it is
 * supplied solely as part of this sample API.
 *
 * @param {int} id
 * @returns angular-model instance or null
 */
function findPostIndex(id) {
  for (var i = 0 ; i < posts.length; i++) {
    if (posts[i]._id === id) {
      return i;
    }
  }
  return null;
}

// Set up the /posts endpoint

/**
 * GET /posts will return the posts in JSON format
 */
app.get('/api/posts', function(req, res) {
  res.json(posts);
});

/**
 * POST /posts will create a new post
 *
 * There is no error checking here. This is a naive example API only.
 */
app.post('/api/posts', function(req, res) {
  var newPost = {
    $links: {
      self: "/posts/" + req.body._id
    },
    _id: req.body._id,
    name: req.body.name,
    body: req.body.name
  };

  posts.push(newPost);
  res.json(true);
});

/**
 * DELETE /posts/id will delete the post identified by request parameter id
 *
 * There is no error checking here. This is a naive example API only.
 */
app.delete('/api/posts/:id', function(req, res) {
  var idx = findPostIndex(req.params.id);
  posts.splice(idx, 1);
  res.json(true);
});

// Start this example API on localhost:4730
app.listen(process.env.PORT || 4730);
console.log("Running on http://localhost:4730/");

