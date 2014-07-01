describe("scaffold", function() {
	var provider;

	beforeEach(module("ur.scaffold.mocks"));

	beforeEach(module("ur.scaffold", function(scaffoldProvider) {
		provider = scaffoldProvider;
	}));

	beforeEach(module("ur.model", function(modelProvider) {
		modelProvider
		.model("Dogs", {
			url: "http://api/dogs",
			defaults: {
				breed: "Unknown"
			}
		});
	}));

	beforeEach(function() {
		this.addMatchers({
			toEqualData: function(expected) {
				return angular.equals(this.actual, expected);
			},
			toBeDeferred: function() {
				return angular.isFunction(this.actual.resolve) &&
					angular.isFunction(this.actual.reject) &&
					angular.isFunction(this.actual.notify);
			}
		});
	});

	describe("provider", function() {

		describe("configuration", function() {

			it("should accept scaffold definitions", inject(function() {
				expect(provider.scaffold("Dogs", {})).toBe(provider);
			}));

			it("should infer the model to use", inject(function(model, scaffold) {
				var dogs = model("Dogs");

				provider.scaffold("Dogs", {});

				expect(scaffold("Dogs").model()).toEqual(dogs);
			}));

			it("should use a given model", inject(function(model, scaffold) {
				var dogs = model("Dogs");

				provider.scaffold("Canines", {
					model: dogs
				});

				expect(scaffold("Canines").model()).toEqual(dogs);

				provider.scaffold("Canines", {
					model: "Dogs"
				});

				expect(scaffold("Canines").model()).toEqual(dogs);
			}));

			it("should work without configuration", inject(function(model, scaffold) {
				var dogs = model("Dogs");

				var s = scaffold("Dogs", {});
				expect(s.model()).toEqual(dogs);
			}));
		});
	});

	describe("service", function() {
		var http, mocks, scaffold;

		beforeEach(inject(function($injector) {
			http = $injector.get('$httpBackend');
			mocks = $injector.get('mocks');
			scaffold = $injector.get('scaffold');

			provider.scaffold("Dogs", {});
		}));

		describe("fetch all", function() {

			it("should GET and store", function() {
				var s = scaffold("Dogs");

				http.expectGET("http://api/dogs").respond(mocks.all);
				http.flush();

				expect(s.items).toEqualData(mocks.all);
			});

			it("should GET and store with default query", function() {
				var s = scaffold("Dogs", {
					query: { breed: "boxer" }
				});

				http.expectGET("http://api/dogs?breed=boxer").respond(mocks.boxers);
				http.flush();

				expect(s.items).toEqualData(mocks.boxers);
			});

			it("should apply a given query", function() {
				var s = scaffold("Dogs");

				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();

				expect(s.items).toEqualData(mocks.all);

				s.query({ breed: "boxer" });

				http.expectGET("http://api/dogs?breed=boxer").respond(mocks.boxers);
				http.flush();

				expect(s.items).toEqualData(mocks.boxers);
			});

			it("should set the loading ui state", function() {
				var s = scaffold("Dogs");
				expect(s.$ui.loading).toBe(true);

				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();

				expect(s.$ui.loading).toBe(false);
			});

			// @todo: use a promise instead? then how do we chain?
			it("should invoke an optional callback after refresh", function() {
				var fn = jasmine.createSpy('post-refresh callback');

				var s = scaffold("Dogs", {
					callback: fn
				});

				expect(fn).not.toHaveBeenCalled();

				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();

				expect(fn).toHaveBeenCalled();
				expect(fn.calls[0].args[0]).toEqualData(mocks.all);
			});

			it("should handle error responses", function() {
				var s = scaffold("Dogs");
				expect(s.$ui.loading).toBe(true);

				http.whenGET("http://api/dogs").respond(404);
				http.flush();

				expect(s.$ui.loading).toBe(false);
				expect(s.items).toEqual([]);
			});
		});

		describe('pagination', function() {

			var headerIncludes = function(name, value) {
				return function(headers) {
					return headers[name] && headers[name] == value;
				};
			};

			it("should use the range request header", function() {
				var s = scaffold("Dogs", {
					paginate: true
				});

				http.expectGET("http://api/dogs", headerIncludes("Range", "resources=0-9"))
					.respond(mocks.all);

				http.flush();
			});

			it("should return an array of pages", function() {
				var s = scaffold("Dogs", {
					paginate: true
				});

				http.whenGET("http://api/dogs").respond(mocks.boxers, {
					'Content-Range': "resources 0-9/40"
				});
				http.flush();

				expect(s.pages).toEqual(4);
			});

			it("should handle unknown totals", function() {
				var s = scaffold("Dogs", {
					paginate: true
				});

				http.whenGET("http://api/dogs").respond(mocks.boxers, {
					'Content-Range': "resources 0-9/*"
				});
				http.flush();

				expect(s.pages).toEqual(null);
			});

			it("should GET a given page", function() {
				var s = scaffold("Dogs", {
					paginate: true
				});

				http.whenGET("http://api/dogs").respond(mocks.boxers);
				http.flush();

				s.page(4);

				http.expectGET("http://api/dogs", headerIncludes('Range', "resources=30-39"))
					.respond(mocks.all);

				http.flush();
			});

			it("should allow custom page sizes", function() {
				var s = scaffold("Dogs", {
					paginate: {
						size: 5
					}
				});

				http.expectGET("http://api/dogs", headerIncludes('Range', "resources=0-4"))
					.respond(mocks.all);

				http.flush();
			});

			it("should allow querying with page", function() {
				var s = scaffold("Dogs", {
					paginate: true
				});

				http.whenGET("http://api/dogs").respond(mocks.boxers);
				http.flush();

				s.query({breed: 'boxers'}, 4);
				http.expectGET("http://api/dogs?breed=boxers", headerIncludes('Range', "resources=30-39"))
					.respond(mocks.all);

				http.flush();
			});
		});

		describe("create", function() {
			var s;

			beforeEach(function() {
				s = scaffold("Dogs");
				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();
			});

			it("should return a deferred", function() {
				expect(s.create()).toBeDeferred();
			});

			it("should hang the model instance from the deferred", function() {
				var dfd = s.create();

				expect(angular.isObject(dfd.$instance)).toBe(true);
				expect(dfd.$instance.breed).toEqual("Unknown");
			});

			it("should create a new object when the deferred is resolved", function() {
				var dfd = s.create();

				angular.extend(dfd.$instance, mocks.one);

				dfd.resolve();

				http.expectPOST("http://api/dogs", mocks.one).respond(mocks.one);
				http.flush();

				expect(s.items.length).toEqual(3);
				expect(s.items[2]).toEqualData(mocks.one);
			});

			it("should not save if the save option is false", function() {
				var dfd = s.create();

				angular.extend(dfd.$instance, mocks.one);

				dfd.resolve({
					save: false
				});

				http.verifyNoOutstandingExpectation();

				expect(s.items.length).toEqual(3);
				expect(s.items[2]).toEqualData(mocks.one);
			});

			it("should set the saving ui state", inject(function($rootScope) {
				http.whenPOST("http://api/dogs", mocks.one).respond(mocks.one);

				var dfd = s.create();
				expect(s.$ui.saving).toBe(false);

				angular.extend(dfd.$instance, mocks.one);
				dfd.resolve();

				$rootScope.$digest();

				expect(s.$ui.saving).toBe(true);

				http.flush();

				expect(s.$ui.saving).toBe(false);
			}));
		});

		// @todo: discuss approach to editing/deleting an item. Currently by index.
		describe("edit", function() {
			var s;

			beforeEach(function() {
				s = scaffold("Dogs");
				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();
			});

			it("should return a deferred", function() {
				expect(s.edit(0)).toBeDeferred();
			});

			it("should hang a copy of the model instance from the deferred", function() {
				var dfd = s.edit(0);

				expect(angular.isObject(dfd.$instance)).toBe(true);
				expect(dfd.$instance.breed).toEqual("jack russel");

				dfd.$instance.breed = "boxer";
				expect(s.items[0].breed).toEqual("jack russel");
			});

			it("should update the object when the deferred is resolved", function() {
				var dfd = s.edit(0);

				angular.extend(dfd.$instance, {
					name: "Digby"
				});

				dfd.resolve();

				http.expectPATCH("http://api/dogs/jerry", dfd.$instance).respond(204);
				http.flush();

				expect(s.items[0].name).toEqual("Digby");
			});

			it("should not update if the save option is false", function() {
				var dfd = s.edit(0);

				angular.extend(dfd.$instance, {
					name: "Digby"
				});

				dfd.resolve({
					save: false
				});

				http.verifyNoOutstandingExpectation();

				expect(s.items[0].name).toEqual("Digby");
			});


			it("should set the saving ui state", inject(function($rootScope) {
				var dfd = s.edit(0);

				expect(s.$ui.saving).toBe(false);

				angular.extend(dfd.$instance, {
					name: "Digby"
				});

				http.whenPATCH("http://api/dogs/jerry", dfd.$instance).respond(204);

				dfd.resolve();

				$rootScope.$digest();

				expect(s.$ui.saving).toBe(true);

				http.flush();

				expect(s.$ui.saving).toBe(false);
			}));
		});

		describe("delete", function() {
			var s;

			beforeEach(function() {
				s = scaffold("Dogs");
				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();
			});

			it("should return a deferred", function() {
				expect(s.delete(0)).toBeDeferred();
			});

			it("should hang the model instance from the deferred", function() {
				var dfd = s.delete(0);

				expect(angular.isObject(dfd.$instance)).toBe(true);
				expect(dfd.$instance.breed).toEqual("jack russel");
			});

			it("should delete the object when the deferred is resolved", function() {
				s.delete(0).resolve();

				http.expectDELETE("http://api/dogs/jerry").respond(204);
				http.flush();
			});

			it("should set the saving ui state", inject(function($rootScope) {
				http.whenDELETE("http://api/dogs/jerry").respond(204);

				expect(s.$ui.saving).toBe(false);

				s.delete(0).resolve();
				$rootScope.$digest();

				expect(s.$ui.saving).toBe(true);

				http.flush();

				expect(s.$ui.saving).toBe(false);
			}));
		});
	});
});
