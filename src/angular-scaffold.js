(function(window, angular, undefined) {
'use strict';

angular.module('ur.scaffold', ['ur.model'])
.provider('scaffold', function() {
	var modelClass;
	var registry = {};

	function ScaffoldClass(options) {
		var config = angular.extend({}, {
			model: options.model,
			query: options.query || {}
		});
		var self = this;

		angular.extend(this, {

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

				return this;
			},

			refresh: function() {
				this.$ui.loading = true;

				modelClass.load(this, {
					items: this.model().all(config.query)
				}).then(function() {
					self.$ui.loading = false;
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
