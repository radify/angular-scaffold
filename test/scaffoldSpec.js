describe("scaffold", function() {
	var provider;

	beforeEach(module("ur.scaffold.mocks"));

	beforeEach(module("ur.scaffold", function(scaffoldProvider) {
		provider = scaffoldProvider;
	}));

	beforeEach(module("ur.model", function(modelProvider) {
		modelProvider
			.model("Dogs", { url: "http://api/dogs" });
	}));

	beforeEach(function() {
		this.addMatchers({
			toEqualData: function(expected) {
				return angular.equals(this.actual, expected);
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

				expect(s.pages).toEqual([1, 2, 3, 4]);
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
		});

		describe("create", function() {
			var s;

			beforeEach(function() {
				s = scaffold("Dogs");
				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();
			});

			it("should return a deferred", function() {
				var deferred = s.create();

				expect(angular.isFunction(deferred.resolve)).toBe(true);
				expect(angular.isFunction(deferred.reject)).toBe(true);
				expect(angular.isFunction(deferred.notify)).toBe(true);
			});

			it("should create a new object when the deferred is resolved", function() {
				var deferred = s.create();

				deferred.resolve(mocks.one);

				http.expectPOST("http://api/dogs", mocks.one).respond(mocks.one);
				http.flush();
			});

			it("should set the saving ui state", function() {
				expect(s.$ui.saving).toBe(false);

				s.create().resolve(mocks.one);

				expect(s.$ui.saving).toBe(true);

				http.whenPOST("http://api/dogs", mocks.one).respond(mocks.one);
				http.flush();

				expect(s.$ui.saving).toBe(false);
			});
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
				var deferred = s.edit(0);

				expect(angular.isFunction(deferred.resolve)).toBe(true);
				expect(angular.isFunction(deferred.reject)).toBe(true);
				expect(angular.isFunction(deferred.notify)).toBe(true);
			});

			it("should update the object when the deferred is resolved", function() {
				var deferred = s.edit(0);

				var data = angular.extend(angular.copy(mocks.one), {
					name: "Digby"
				});

				deferred.resolve(data);

				http.expectPATCH("http://api/dogs/1", data).respond(data);
				http.flush();
			});

			it("should set the saving ui state", function() {
				var data = angular.extend(angular.copy(mocks.one), {
					name: "Digby"
				});

				expect(s.$ui.saving).toBe(false);

				s.edit(0).resolve(data);

				expect(s.$ui.saving).toBe(true);

				http.whenPATCH("http://api/dogs/1", data).respond(data);
				http.flush();

				expect(s.$ui.saving).toBe(false);
			});
		});

		describe("delete", function() {
			var s;

			beforeEach(function() {
				s = scaffold("Dogs");
				http.whenGET("http://api/dogs").respond(mocks.all);
				http.flush();
			});

			it("should return a deferred", function() {
				var deferred = s.delete(0);

				expect(angular.isFunction(deferred.resolve)).toBe(true);
				expect(angular.isFunction(deferred.reject)).toBe(true);
				expect(angular.isFunction(deferred.notify)).toBe(true);
			});

			it("should delete the object when the deferred is resolved", function() {
				var deferred = s.delete(0);

				deferred.resolve();

				http.expectDELETE("http://api/dogs/1").respond(204);
				http.flush();
			});

			it("should set the saving ui state", function() {
				expect(s.$ui.saving).toBe(false);

				s.delete(0).resolve();

				expect(s.$ui.saving).toBe(true);

				http.whenDELETE("http://api/dogs/1").respond(204);
				http.flush();

				expect(s.$ui.saving).toBe(false);
			});
		});
	});
});
