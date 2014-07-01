(function(window, angular, undefined) {
'use strict';

angular.module('ur.scaffold', ['ur.model'])
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
					'Range': "resources=" + first + "-" + last
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

			pages: null,

			$ui: {
				loading: false,
				saving: false,
			},

			$config: function() {
				return config;
			},

			$init: function() {
				if (modelClass && !angular.isObject(config.model)) {
					config.model = modelClass(config.model);
				}

				return this.refresh();
			},

			model: function() {
				return config.model;
			},

			query: function(query, page) {
				config.query = query;

				if (config.paginate) {
					return this.page(page || 1);
				}

				return this.refresh();
			},

			page: function(page) {
				config.paginate.page = page;

				if (config.paginate.strategy === 'infinite') {
					return this.refresh({append: true});
				}

				return this.refresh();
			},

			total: function() {
				return total;
			},

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

				return this;
			},

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
