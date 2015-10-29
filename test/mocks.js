angular.module('ur.scaffold.mocks', [])
.value('mocks', {
	all: [
		{
			$links: {
				self: "http://api/dogs/jerry"
			},
			name: "Jerry",
			breed: "jack russel"
		},
		{
			$links: {
				self: "http://api/dogs/mac"
			},
			name: "Mac",
			breed: "boxer"
		}
	],
	boxers: [
		{
			$links: {
				self: "http://api/dogs/mac"
			},
			name: "Mac",
			breed: "boxer"
		}
	],
	one: {
		name: "Jerry",
		breed: "jack russel"
	}
});
