module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [ 'jasmine' ],
    files: [
		'bower_components/jquery/dist/jquery.js',
		'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.min.js',
		'bower_components/angular-bootstrap/ui-bootstrap.min.js',
		'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'bower_components/angular-mocks/angular-mocks.js',
		'bower_components/angular-resource/angular-resource.min.js',
		'bower_components/angular-ui-router/release/angular-ui-router.min.js',
		'bower_components/underscore/underscore.js',
        'bower_components/firebase/firebase.js',
        'bower_components/angularfire/dist/angularfire.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'dist/app.js',
        'tests/**/*.js'
    ],
    preprocessors: {
		'app/**/templates/*.html': 'ng-html2js'
    },
    reporters: [ 'progress' ],
    colors: true,
    autoWatch: false,
    browsers: [ 'PhantomJS' ],
    singleRun: true,
    plugins: [
		'karma-phantomjs-launcher',
		'karma-jasmine',
		'karma-ng-html2js-preprocessor'
    ]
  });
};
