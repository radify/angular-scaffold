module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-model/src/angular-model.js',
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
