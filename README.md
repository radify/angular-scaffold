Angular Scaffold
==

Description
--

Angular Scaffold is a collection of convenience wrappers around angular-model collections.

Dependencies
--

* [AngularJS](https://angularjs.org/)
* [Angular Model](https://github.com/radify/angular-model)

Running unit tests
--

Install the test runner with npm:

```bash
npm install
```

You can then run the tests with Gulp:

```bash
gulp
```

You can run coverage with:

```bash
gulp coverage
```

angular-scaffold API docs
--

See [/docs/api.md](/docs/api.md) in this project for detailed documentation of all angular-scaffold's functions.

Supporting angular-scaffold in your API
--

Your API must:

* Use and interpret HTTP headers correctly (e.g. HTTP PUT, POST, GET and DELETE)
* Consume and return json
* Supply a `$links` collection containing a `self` key, e.g.:

```json
[
    {
        "$links": {
            "self": "/api/posts/postaa"
        },
        "_id":"posta",
        "name":"Post A",
        "body":"Some content for Post A"
    }
]
```

Basic Usage
--

In your AngularJS application, include the JavaScript:

```html
// your specific paths may vary
<script src="node_modules/radify/angular-model.js"></script>
<script src="node_modules/radify/angular-scaffold.js"></script>
```

In your app configuration, state a dependency on [Angular Model](https://github.com/radify/angular-model) and [Angular Scaffold](https://github.com/radify/angular-scaffold):

```javascript
angular.module('myApp', [
	'ur.model',
	'ur.scaffold'
]);
```

Example controller using Angular Scaffold:

```javascript
.controller('PostsController', function($scope, scaffold) {
	angular.extend($scope, {
		posts: scaffold('Posts', {})
	});
})
```

Basic CRUD example project
--

An [example application is included in this repository](/sample-project/). It has a very simple API that illustrates a basic use case for angular-scaffold.

To install and run the sample project:

```bash
cd sample-project
npm install
node server.js
```

You can then browse to http://localhost:4730/ and add/remove Post objects from a list. angular-scaffold takes care of talking to the API for you.

Pagination
--

angular-scaffold can paginate your model. Your API will need to support the `Range: resources=n-n` header to take advantage of this. For example, `Range: resources=10-20` would return resources 10 through 20.

```javascript
scaffold('Shares', {
paginate: { size: 20, page: 1, strategy: 'paged' }
});
```

Querying
--

You can pass a specific query in, which will be sent through to the API. Your API will have to know how to respond to this.

```javascript
scaffold('Comments', {
  query: {
    offline: $scope.selected._id
  }
});
```

You can also pass in an ordering parameter. Again, your API will have to know what to do with it.

```javascript
return scaffold('Shares', {
  query: { to: true, order: { _id: 'desc'} }
});
```

TODO list
--

Before going "live":

* [ ] Get this and `angular-model` into npm/bower
* [ ] Remove `sample-project/tmp/*` in favour of package managed version (as above)
