var app = angular.module("app",['templates-dist', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'pascalprecht.translate'])

	.controller("mainController", [ '$scope', 'ArrayService', '$sce', function($scope, ArrayService,$sce) {
		
	}])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$resourceProvider', '$httpProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider, $httpProvider) {
			$urlRouterProvider.otherwise("/");

			$stateProvider
				.state('app', {url:'/', templateUrl: '../app/core/main.html', abstract: true})
				.state('app.section', {url:'', template: '<app-section></app-section>'});

			$locationProvider.html5Mode(true);
			$resourceProvider.defaults.stripTrailingSlashes = false;

	}])

	.constant("APPLICATION_CONFIG", {
	    "NAME": "ANGULAR_SLIDES"
	})

	.constant("API_CONFIG", {
	    "BASE_URL": ""
	})

	.run(['$rootScope', '$location', '$window', '$state', function($rootScope, $location, $window, $state){
	     $rootScope.$on('$stateChangeSuccess',
	        function(event){
	            if (!$window.ga)
	            return;
	            //$window.ga('send', 'pageview', { page: $location.path() });
	    });

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {

		});

	}]);
