var app = angular.module("app",['templates-dist', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource'])

	.controller("mainController", [ '$scope', 'ArrayService', 'DataService' ,'$sce', function($scope, ArrayService, DataService,$sce) {
		//var a  = DataService.all(type, results);
		//console.log(a);
		//var a =  DataService.getById("posts", 1);

		DataService.getById("posts", 1).then(function(data){
      		console.log($sce.valueOf(data.content));
    	});
		
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
