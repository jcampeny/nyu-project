angular.module('app').directive('nyuHome', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/home/home.html',
    controllerAs: 'nyuHome',
    controller: function ($scope, $timeout) {
    	$timeout(function(){
    		if(typeof twttr !== "undefined"){
    			twttr.widgets.load();		
    		}
    	},0);
    }
  };
});
