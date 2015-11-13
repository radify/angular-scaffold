module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'lib/angular.js',
      'lib/angular-mocks.js',
      'lib/angular-model.js',
      'src/*.js',
      'spec/*.js'
    ],
    exclude: [],
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    preprocessors: {'src/**/*.js': ['coverage']},
    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage/'
    }
  });
};
