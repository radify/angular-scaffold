(function(window, angular, undefined) {
'use strict';

var module = angular.module('ur.scaffold', ['ng', 'ur.model']);

module.factory('scaffold', ['model', 'pageData', function(model, pageData) {

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
		options.lists = options.lists || pageData.lists();

		var _ = {
			editing: null,
			edited: null,
			Model: isString(options.model) ? model(options.model) : options.model,
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
					var result = null;
					var self = this;
					$scope.items.add($scope.items["new"])
						.success(function(){
							result = $scope.items["new"];
							self.create();
						})
						.success(options.save);
					return result;
				},

				edit: function(index) {

					function _restore() {
						if (_.editing === null || _.editing === false) {
							return;
						}
						$scope.items[_.editing] = _.Model.create(_.edited);
						_.editing = _.edited = null;
					}

					function _save(index) {
						if (index === null || index === false) {
							return;
						}
						_.editing = index;
						_.edited = copy($scope.items[_.editing]);
					}

					if (arguments.length === 0) {
						$scope.items[_.editing].$save()
							.success(function(){_.editing = null;})
							.success(options.save);
						return;
					}
					_restore();
					_save(index);
				},

				isEditing: function(index) {
					if (arguments.length === 0) {
						return _.editing;
					}
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

}]).factory('pageData', ['$document', function($document) {

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