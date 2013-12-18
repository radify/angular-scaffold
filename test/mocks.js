angular.module('ur.scaffold.mocks', [])
.value('mocks', {
	all: [
		{ name: "Jerry", breed: "jack russel" },
		{ name: "Mac", breed: "boxer" }
	],
	boxers: [
		{ name: "Mac", breed: "boxer" }
	],
	one: { name: "Jerry", breed: "jack russel" },
});
