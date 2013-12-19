(function(window, angular, undefined) {
'use strict';

angular.module('ur.scaffold', ['ur.model'])
.provider('scaffold', function() {
	var modelClass;
	var registry = {};

	function ScaffoldClass(options) {
		var self = this,
			config = angular.extend({}, {
				model: options.model,
				query: options.query || {},
			}),
			paginate = {
				size: 10,
				page: 1
			};

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
			if(!headers['content-range']) {
				return [];
			}

			var regex = /^resources \d+-\d+\/(\d+)$/,
				matches = headers['content-range'].match(regex),

				total = matches[1],

				pages = Math.ceil(total / config.paginate.size),

				result = [];

			for (var i = 0; i < pages; i++) {
				result.push(i + 1);
			}

			return result;
		}

		angular.extend(this, {

			pages: [],

			$ui: {
				loading: false,
				saving: false,
			},

			$config: function() {
				return config;
			},

			model: function() {
				return config.model;
			},

			query: function(query) {
				config.query = query;

				return this.refresh();
			},

			page: function(page) {
				config.paginate.page = page;

				return this.refresh();
			},

			refresh: function() {
				this.$ui.loading = true;

				var promise = this.model().all(config.query, paginateHeaders());

				promise.then(function(data) {
					self.items = data;
					self.$ui.loading = false;

					self.pages = getPages(promise.$response.headers());
				});

				return this;
			},

			$init: function() {
				if (modelClass && !angular.isObject(config.model)) {
					config.model = modelClass(config.model);
				}

				return this.refresh();
			},
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

		$get: ['model', function(model) {
			modelClass = model;

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
