/**
 * Angular Scaffold is a collection of convenience wrappers around angular-model collections.
 *
 * {@copyright 2015, Radify, Inc (http://radify.io/)}
 * {@link https://github.com/radify/angular-model#readme}
 *
 * @license BSD-3-Clause
 */
(function(window, angular, undefined) {
'use strict';

/**
 * @ngdoc overview
 * @name ur.scaffold
 * @requires angular
 * @requires ur.model
 * @description
 * Angular Scaffold is a collection of convenience wrappers around angular-model collections.
 */
angular.module('ur.scaffold', ['ur.model'])
/**
 * @ngdoc object
 * @name ur.scaffold
 * @requires angular
 * @requires ur.model
 * @description
 * Provider for angular-scaffold
 *
 *      var s = scaffold("Dogs", {
 *       paginate: { size: 1, strategy: 'infinite' }
 *     });
 */
.provider('scaffold', function() {
	var modelClass, q;
	var registry = {};

	function ScaffoldClass(options) {
		var self = this,
			config = angular.extend({ query: {} }, options),
			paginate = { size: 10, page: 1, strategy: 'paged' },
			total = 0;

		if (angular.isObject(options.paginate)) {
			config.paginate = angular.extend({}, paginate, options.paginate);
		}

		if (options.paginate === true) {
			config.paginate = paginate;
		}

		function paginateHeaders() {
			if (config.paginate) {
				var size = config.paginate.size,
					page = config.paginate.page,
					first = size * (page - 1),
					last  = (size * page) - 1;

				return {
					'Range': 'resources=' + first + '-' + last
				};
			}

			return null;
		}

		function getPages(headers) {
			if(!config.paginate || !headers['content-range']) {
				return [];
			}

			var regex = /^resources \d+-\d+\/(\d+|\*)$/,
				matches = headers['content-range'].match(regex);

			if (matches === null || angular.isUndefined(matches[1]) || matches[1] === '*') {
				return null;
			}

			total = matches[1];
            return Math.ceil(total / config.paginate.size);
		}

		angular.extend(this, {

			/**
			 * @ngdoc number
			 * @name ur.scaffold:pages
			 * @propertyOf ur.scaffold
			 * @description
			 * the count of pages that the API reported to the scaffold
			 */
			pages: null,

			/**
			 * @ngdoc object
			 * @name ur.scaffold:$ui
			 * @propertyOf ur.scaffold
			 * @description
			 * User interface related convenience properties, so in your UI, you can show saving and loading states
			 */
			$ui: {
				loading: false,
				saving: false,
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:$config
			 * @methodOf ur.scaffold
			 * @description
			 * Get the configuration for this angular-scaffold instance
			 * @returns {object} Configuration of this angular-scaffold instance
			 */
			$config: function() {
				return config;
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:$init
			 * @methodOf ur.scaffold
			 * @description
			 * Initialise this scaffold
			 * @returns {object} Returns this object, supporting method chaining
			 */
			$init: function() {
				if (modelClass && !angular.isObject(config.model)) {
					config.model = modelClass(config.model);
				}

				return this.refresh();
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:model
			 * @methodOf ur.scaffold
			 * @description
			 * Returns the configuration for this angular-scaffold instance
			 * @returns {string} The underlying model this object is configured with
			 */
			model: function() {
				return config.model;
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:query
			 * @methodOf ur.scaffold
			 * @description
			 * Get the configuration for this angular-scaffold instance
			 *
			 * @param {object} query e.g. { name: 'name to search for' }
			 * @param {number=} page If supplied, used to determine which page of results to show
			 * @returns {object} Configuration of this angular-scaffold instance
			 */
			query: function(query, page) {
				config.query = query;

				if (page) {
					return this.page(page);
				}

				return this.refresh();
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:page
			 * @methodOf ur.scaffold
			 * @description
			 * Select a page
			 *
			 * @param {number} page Page of results to show
			 * @returns {object} Configuration of this angular-scaffold instance
       */
			page: function(page) {
				config.paginate.page = page;

				if (config.paginate.strategy === 'infinite') {
					return this.refresh({append: true});
				}

				return this.refresh();
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:total
			 * @methodOf ur.scaffold
			 * @description
			 * How many results in total are in the scaffold (not just the current page)
			 *
			 * @returns {number} Total results
			 */
			total: function() {
				return total;
			},

			/**
			 * @ngdoc function
			 * @name ur.scaffold:refresh
			 * @methodOf ur.scaffold
			 * @description
			 * Go to the API and refresh
			 * @param {object=} options Query options to pass to the underlying angular-model `all` query.
       * Includes `callback`, which can be a callback function for when the refresh completes.
			 *
			 * @returns {object} Returns this object, supporting method chaining
			 */
			refresh: function(options) {
				options = options || {
					append: false
				};

				this.$ui.loading = true;

				var promise = config.model.all(config.query, paginateHeaders());

				var success = function(data) {
					self.pages = getPages(promise.$response.headers());

					if (options.append === true) {
						self.items = self.items.concat(data);
						return data;
					}

					self.items = data;

					return data;
				};

				var error = function(data) {
					self.items = [];
				};

				var cleanup = function() {
					self.$ui.loading = false;
				};

				if (angular.version.minor > 1) {
					promise.then(success).catch(error).finally(cleanup);
				} else {
					promise.then(success, error).always(cleanup);
				}

				if (angular.isFunction(config.callback)) {
					promise.then(config.callback);
				}

				if (angular.isFunction(options.callback)) {
					promise.then(options.callback);
				}

				return this;
			},

			/**
			 * @ngdoc function
			 * @name create
			 * @methodOf ur.scaffold
			 * @description
			 * Creates a new object when the deferred promise is resolved
			 * @returns {object} Deferred promise
			 */
			create: function() {
				var deferred = q.defer(),

					defaults = {
						save: true
					},

					saved = function() {
						self.items.push(deferred.$instance);
						self.$ui.saving = false;
					};

				deferred.promise.then(function(options) {
					self.$ui.saving = true;

					options = angular.extend({}, defaults, options);

					if (options.save === false) {
						return saved();
					}

					deferred.$instance.$save().then(saved);
				});

				deferred.$instance = config.model.create();

				return deferred;
			},

			/**
			 * @ngdoc function
			 * @name edit
			 * @methodOf ur.scaffold
			 * @param {(number|object)} index Either the index of the item in the collection to edit,
			 *   or the object itself, which will be searched for in the collection
			 * @description
			 * Find `index` and set it up for editing.
			 *
			 * Updates the object when the deferred promise is resolved
			 * @returns {object} Deferred promise
			 */
			edit: function(index) {
				var deferred = q.defer(),

					defaults = {
						save: true
					},

					saved = function() {
						self.items[index] = deferred.$instance;
						self.$ui.saving = false;
					};

				deferred.promise.then(function(options) {
					self.$ui.saving = true;

					options = angular.extend({}, defaults, options);

					if (options.save === false) {
						return saved();
					}

					deferred.$instance.$save().then(saved);
				});

				deferred.$instance = angular.copy(this.items[index]);

				return deferred;
			},

			/**
			 * @ngdoc function
			 * @name delete
			 * @methodOf ur.scaffold
			 * @param {(number|object)} index Either the index of the item in the collection to remove, or the object
			 *     itself, which will be searched for in the collection
			 * @description
			 * Find `index` and delete it from the API, then remove it from the collection
			 * @returns {object} Promise
			 */
			delete: function(index) {
				var deferred = q.defer();

				deferred.promise.then(function(data) {
					self.$ui.saving = true;

					deferred.$instance.$delete().then(function() {
						self.$ui.saving = false;
					});
				});

				deferred.$instance = this.items[index];

				return deferred;
			}
		});
	}

	function config(name, options) {
		if (registry[name]) {
			var current = registry[name].$config();
			registry[name] = new ScaffoldClass(angular.extend({}, current, options));
		} else {
			if (angular.isUndefined(options.model)) {
				options.model = name;
			}

			registry[name] = new ScaffoldClass(options);
		}

		return registry[name];
	}

	angular.extend(this, {

		/**
		 * @ngdoc function
		 * @name ur.scaffoldProvider:scaffold
		 *
		 * @description
		 * Configure a scaffold
		 *
		 * @example
		 * var s = scaffold("Dogs", {
					paginate: true
			 });
		 * @param {string} name The name
		 * @param {object=} options Configuration object
		 * @returns {object} Created scaffold object
     */
		scaffold: function(name, options) {
			config(name, options);
			return this;
		},

		$get: ['$q', 'model', function($q, model) {
			modelClass = model;
			q = $q;

			function ScaffoldClassFactory(name, options) {
				if (!angular.isUndefined(options)) {
					config(name, options);
				}

				return registry[name].$init() || undefined;
			}

			return ScaffoldClassFactory;
		}]
	});
});

})(window, window.angular);
