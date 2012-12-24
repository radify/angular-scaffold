(function(window, angular, undefined) {
'use strict';

var module = angular.module('ngScaffold', ['ng', 'ngModel']);

module.factory('$scaffold', ['$model', '$pageData', function($model, $pageData) {

	var extend   = angular.extend,
		copy     = angular.copy,
		isString = angular.isString,
		noop     = angular.noop,
		forEach  = angular.forEach;

	return function($scope, options) {
		var defaults = {
			defaults: {},
			query: {},
			save: noop,
			remove: noop,
			lists: null,
			model: null
		};

		options = extend(defaults, options || {});
		options.lists = options.lists || $pageData.lists();

		var _ = {
			editing: null,
			Model: isString(options.model) ? $model(options.model) : options.model,
			lists: {}
		};

		forEach(options.lists, function(def, key) {
			if (def.items === undefined) {
				def = { items: def };
			}
			def.add = def.add || function(target, item) {
				target[def.key || key].push(item);
			};
			_.lists[key] = copy(def, _.lists[key] || {});

			_.lists[key].add = function(target, item) {
				return item ? def.add(target, item) : null;
			};
		});

		extend($scope, {

			items: extend(_.Model.find(options.query), {
				"new": _.Model.create(options.defaults)
			}),

			ui: extend(_.lists, {

				add: function() {
					$scope.items.add($scope.items["new"]);
					var result = $scope.items["new"];
					this.create();
					return result;
				},

				edit: function(index) {
					if (arguments.length === 0) {
						$scope.items[_.editing].$save().success(options.save);
						_.editing = null;
						return;
					}
					_.editing = index;
				},

				isEditing: function(index) {
					return index === _.editing;
				},

				remove: function(index) {
					$scope.items.remove(index, options.remove);
				},

				create: function() {
					return $scope.items["new"] = _.Model.create(options.defaults);
				}
			})
		});
	};

}]).factory('$pageData', ['$document', function($document) {
	
	var data = $document.get(0).pageData;
	var _lists = {};

	if (data._lists) {
		for (var n in data._lists) {
			// @todo Make empty item configurable
			_lists[n] = angular.extend(data._lists[n], { /* "": "" */ });
		}

		delete data._lists;
	}

	return {
		get: function(key) {
			if (!key) {
				return data;
			}
			if (!key.indexOf('.')) {
				return data[key];
			}
			key = key.split('.');
			var result = data;

			for (var i = 0; i < key.length; i++) {
				if (result[key] === undefined) {
					return null;
				}
				result = result[key];
			}
			return result;
		},

		lists: function(key) {
			if (key === undefined || typeof key === 'string') {
				return (key ? _lists[key] : _lists) || null;
			}
			var result = angular.copy(_lists, {});

			for (var n in key) {
				if (result[n] === undefined) {
					continue;
				}
				result[n] = angular.extend(key[n], { items: result[n] });
			}
			return result;
		}
	};

}]);

})(window, window.angular);