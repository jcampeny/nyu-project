var app = angular.module("app",['templates-dist', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'pascalprecht.translate'])

	.controller("mainController", [ '$scope', 'ArrayService', '$sce', 'DataService', function($scope, ArrayService,$sce,DataService) {
		
		//DataService.all("type", "per_page", "page").then(function(post) {
			//ex: posts , int || "all", int
		//});

	}])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$resourceProvider', '$httpProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider, $httpProvider) {
			$urlRouterProvider.otherwise("/");

			$stateProvider
				.state('app', {url:'/', templateUrl: '../app/core/main.html', abstract: true})

				.state('app.test-comtrade', {url:'comtrade', template: '<app-test-comtrade></test-comtrade>'})
				.state('app.test-worldbank',{url:'worldbank', template: '<app-test-worldbank></app-test-worldbank>'})
				.state('app.test-imf', 		{url:'imf', template: '<app-test-imf></app-test-imf>'})				
				
				.state('app.home', {url:'', template: '<nyu-home></nyu-home>'})
				.state('app.about', {url:'about', template: '<nyu-about></nyu-about>'})

				.state('app.books', {url:'books', template: '<nyu-list entity="books"></nyu-list>'})
				.state('app.booksitem', {url:'books/:id/:title', template: '<nyu-item entity="books"></nyu-item>'})
				
				.state('app.global', {url:'globalization-index-reports', template: '<nyu-list entity="global"></nyu-list>'})
				.state('app.globalitem', {url:'globalization-index-reports/:id/:title', template: '<nyu-item entity="global"></nyu-item>'})
				
				.state('app.working', {url:'working-papers', template: '<nyu-list entity="working"></nyu-list>'})
				.state('app.workingitem', {url:'working-papers/:id/:title', template: '<nyu-item entity="working"></nyu-item>'})

				.state('app.blog', {url:'blog', template: '<nyu-list entity="blog"></nyu-list>'})
				.state('app.blogitem', {url:'blog/:id/:title', template: '<nyu-item entity="blog"></nyu-item>'})

				.state('app.videos', {url:'videos', template: '<nyu-list-columns entity="global"></nyu-list-columns>'})

				.state('app.podcasts', {url:'podcasts', template: '<nyu-list entity="podcasts"></nyu-list>'})
				.state('app.podcastsitem', {url:'podcasts/:id/:title', template: '<nyu-item entity="podcasts"></nyu-item>'})

				.state('app.press', {url:'press', template: '<nyu-list entity="press"></nyu-list>'})
				.state('app.presstsitem', {url:'press/:id/:title', template: '<nyu-item entity="press"></nyu-item>'})

				.state('app.mediakit', {url:'mediakit', template: '<nyu-mediakit></nyu-mediakit>'})

				.state('app.globecourse', {url:'globe-course', template: '<nyu-item entity="globecourse"></nyu-item>'})
				.state('app.globedocuments', {url:'globe-course/documents', template: '<nyu-list entity="globedocuments"></nyu-list>'})
				.state('app.globedocumentsitem', {url:'globe-course/documents/:id/:title', template: '<nyu-item entity="globedocuments"></nyu-item>'})
				.state('app.globereadings', {url:'globe-course/readings', template: '<nyu-list entity="globereadings"></nyu-list>'})
				.state('app.globereadingsitem', {url:'globe-course/readings/:id/:title', template: '<nyu-item entity="globereadings"></nyu-item>'})
				.state('app.globecases', {url:'globe-course/cases', template: '<nyu-list entity="globecases"></nyu-list>'})
				.state('app.globecasesitem', {url:'globe-course/cases/:id/:title', template: '<nyu-item entity="globecases"></nyu-item>'})
				.state('app.globenotes', {url:'globe-course/notes', template: '<nyu-list entity="globenotes"></nyu-list>'})
				.state('app.globenotesitem', {url:'globe-course/notes/:id/:title', template: '<nyu-item entity="globenotes"></nyu-item>'})
				.state('app.globepresentations', {url:'globe-course/presentations', template: '<nyu-list entity="globepresentations"></nyu-list>'})
				.state('app.globepresentationsitem', {url:'globe-course/presentations/:id/:title', template: '<nyu-item entity="globepresentations"></nyu-item>'})
				
				.state('app.cases', {url:'cases-teaching-notes', template: '<nyu-list entity="cases"></nyu-list>'})
				.state('app.casesitem', {url:'cases-teaching-notes/:id/:title', template: '<nyu-item entity="cases"></nyu-item>'})

				.state('app.notes', {url:'globalization-notes', template: '<nyu-list entity="press"></nyu-list>'})
				.state('app.notesitem', {url:'globalization-notes/:id/:title', template: '<nyu-item entity="press"></nyu-item>'})

				.state('app.other', {url:'other-teaching-materials', template: '<nyu-list entity="other"></nyu-list>'})
				.state('app.otheritem', {url:'other-teaching-materials/:id/:title', template: '<nyu-item entity="other"></nyu-item>'})

				.state('app.surveys', {url:'surveys', template: '<nyu-surveys></nyu-surveys>'})
				.state('app.survey-gap', {url:'surveys/gap-survey', template: '<nyu-gapsurvey></nyu-gapsurvey>'})
				.state('app.markets-gap', {url:'surveys/markets-survey', template: '<nyu-marketssurvey></nyu-marketssurvey>'});

			$locationProvider.html5Mode(true);
			$resourceProvider.defaults.stripTrailingSlashes = false;

	}])

	.constant("APPLICATION_CONFIG", {
	    "NAME": "ANGULAR_WORDPRESS"
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
