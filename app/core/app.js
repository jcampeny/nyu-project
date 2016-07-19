var app = angular.module("app",['templates-dist', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngResource', 'ngSanitize', 'pascalprecht.translate', 'ngTagsInput', '720kb.socialshare', 'ng.deviceDetector', 'vcRecaptcha'])

	.controller("mainController", [ '$rootScope', '$timeout', 'DataService', function($rootScope, $timeout, DataService) {
		/*DataService.getMedia('file').then(function(images){
			console.log(images);
		});*/
		DataService.downloadMedia();
		$rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
	    	$rootScope.headerOpened = false;
	    	$rootScope.currentState = toState.name;
	    	$rootScope.mobileShowFilters = false;
	    	$rootScope.mobileFiltersLeft = '200%';

			$rootScope.toggleMobileFilters = function(){
				
				if($rootScope.mobileShowFilters){
					$timeout(function(){
						$rootScope.mobileFiltersLeft = '200%';
						$('.mobile-filter').animate({
							opacity: '0',
							top: '25%',
							'z-index' : '-100'
						},400);
					},500);	
				}else{
					$('.mobile-filter').animate({
						opacity: '1',
						top: '0%',
						'z-index' : '100'
					},400);
					$rootScope.mobileFiltersLeft = '0';
				}
				$rootScope.mobileShowFilters = !$rootScope.mobileShowFilters;
			};

			$timeout(function(){
				$('.main-menu li').hover(function(){
					$(this).addClass("showsubmenu");
				},function(){
					$(this).removeClass("showsubmenu");
				});

				$('.submenu li').click(function(){
					$('.main-menu li').removeClass("showsubmenu");
				});

			},0);
	    });
	}])

	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$resourceProvider', '$httpProvider',
		function($stateProvider, $urlRouterProvider, $locationProvider, $resourceProvider, $httpProvider) {
			$urlRouterProvider.otherwise("404");

			$stateProvider
				.state('app', {url:'/', templateUrl: '../app/core/main.html', abstract: true})
				.state('app.home', {url:'', template: '<nyu-home></nyu-home>'})
				.state('app.about', {url:'about', template: '<nyu-about></nyu-about>'})
				.state('app.search', {url:'search', template: '<nyu-search entity="search"></nyu-search>'})
				.state('app.notfound', {url:'404', template: '<nyu-not-found></nyu-not-found>'})

				.state('app.books', {url:'books', template: '<nyu-list entity="books"></nyu-list>'})
				.state('app.booksitem', {url:'books/:id/:title', template: '<nyu-item entity="books"></nyu-item>'})

				.state('app.articles', {url:'articles', template: '<nyu-list entity="articles"></nyu-list>'})
				.state('app.articlesitem', {url:'articles/:id/:title', template: '<nyu-item entity="articles"></nyu-item>'})
				
				.state('app.global', {url:'gci', template: '<nyu-list entity="global"></nyu-list>'})
				.state('app.globalitem', {url:'gci/:id/:title', template: '<nyu-item entity="global"></nyu-item>'})
				
				.state('app.working', {url:'working-papers', template: '<nyu-list entity="working"></nyu-list>'})
				.state('app.workingitem', {url:'working-papers/:id/:title', template: '<nyu-item entity="working"></nyu-item>'})

				.state('app.blog', {url:'blog', template: '<nyu-list entity="blog"></nyu-list>'})
				.state('app.blogitem', {url:'blog/:id/:title', template: '<nyu-item entity="blog"></nyu-item>'})

				.state('app.videos', {url:'videos', template: '<nyu-list-columns entity="videos"></nyu-list-columns>'})
				.state('app.videositem', {url:'videos/:id/:title', template: '<nyu-item entity="videos"></nyu-item>'})

				.state('app.podcasts', {url:'podcasts', template: '<nyu-list entity="podcasts"></nyu-list>'})
				.state('app.podcastsitem', {url:'podcasts/:id/:title', template: '<nyu-item entity="podcasts"></nyu-item>'})

				.state('app.press', {url:'press', template: '<nyu-list entity="press"></nyu-list>'})
				.state('app.pressitem', {url:'press/:id/:title', template: '<nyu-item entity="press"></nyu-item>'})

				.state('app.mediakit', {url:'mediakit', template: '<nyu-mediakit></nyu-mediakit>'})

				.state('app.globecourse', {url:'globe-course', template: '<nyu-globecourse></nyu-globecourse>'})
				.state('app.globedocuments', {url:'globe-course/documents', template: '<nyu-list entity="globecourse" subentity="globedocuments"></nyu-list>'})
				.state('app.globedocumentsitem', {url:'globe-course/documents/:id/:title', template: '<nyu-item entity="globecourse" subentity="globedocuments"></nyu-item>'})
				.state('app.globereadings', {url:'globe-course/readings', template: '<nyu-list entity="globecourse" subentity="globereadings"></nyu-list>'})
				.state('app.globereadingsitem', {url:'globe-course/readings/:id/:title', template: '<nyu-item entity="globecourse" subentity="globereadings"></nyu-item>'})
				.state('app.globecases', {url:'globe-course/cases', template: '<nyu-list entity="globecourse" subentity="globecases"></nyu-list>'})
				.state('app.globecasesitem', {url:'globe-course/cases/:id/:title', template: '<nyu-item entity="globecourse" subentity="globecases"></nyu-item>'})
				.state('app.globenotes', {url:'globe-course/notes', template: '<nyu-list entity="globecourse" subentity="globenotes"></nyu-list>'})
				.state('app.globenotesitem', {url:'globe-course/notes/:id/:title', template: '<nyu-item entity="globecourse" subentity="globenotes"></nyu-item>'})
				.state('app.globepresentations', {url:'globe-course/presentations', template: '<nyu-list entity="globecourse" subentity="globepresentations"></nyu-list>'})
				.state('app.globepresentationsitem', {url:'globe-course/presentations/:id/:title', template: '<nyu-item entity="globecourse" subentity="globepresentations"></nyu-item>'})
				
				.state('app.cases', {url:'cases-teaching-notes', template: '<nyu-list entity="cases"></nyu-list>'})
				.state('app.casesitem', {url:'cases-teaching-notes/:id/:title', template: '<nyu-item entity="cases"></nyu-item>'})

				.state('app.notes', {url:'globalization-notes', template: '<nyu-list entity="notes"></nyu-list>'})
				.state('app.notesitem', {url:'globalization-notes/:id/:title', template: '<nyu-item entity="notes"></nyu-item>'})

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
	     $rootScope.$on('$stateChangeSuccess',function(event){
	        	document.body.scrollTop = document.documentElement.scrollTop = 0;
	            if (!$window.ga)
	            return;
	            //$window.ga('send', 'pageview', { page: $location.path() });
	    });



		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {

		});

	}]);
