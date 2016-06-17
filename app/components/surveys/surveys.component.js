angular.module('app').directive('nyuSurveys', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/surveys.html',
    controllerAs: 'nyuSurveys',
    controller: function ($scope) {
    	var groups = {
			cases:{name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases", suboptions: []},
            notes:{name: "Globalization Notes", group: "Teaching Materials", state: "app.notes", suboptions: []},
            surveys:{name: "Surveys", group: "Teaching Materials", state: "app.surveys", suboptions: []},
            other:{name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other", suboptions: []}
        };
    	$scope.groupItems = function(){
    		return groups;
    	};
    }
  };
});
