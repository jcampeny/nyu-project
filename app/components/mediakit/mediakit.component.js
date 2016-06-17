angular.module('app').directive('nyuMediakit', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/mediakit/mediakit.html',
    controllerAs: 'nyuMediakit',
    controller: function ($scope) {
    	$scope.entity = "mediakit";

    	$scope.entityLabels = {
    		books:{name: "Books", group: "Publications", state: "app.books", suboptions: []},
    		global:{name: "Globalization Index Reports", group: "Publications", state: "app.global", suboptions: []},
    		articles:{name: "Articles & Book Chapters", group: "Publications", state: "app.articles", suboptions: []},
    		working:{name: "Working Papers", group: "Publications", state: "app.working", suboptions: []},
    		blog:{name: "Blog", group: "Publications", state: "app.blog", suboptions: []},

    		videos:{name: "Videos", group: "News & Media", state: "app.videos", suboptions: []},
    		podcasts:{name: "Podcasts", group: "News & Media", state: "app.podcasts", suboptions: []},
    		press:{name: "Press", group: "News & Media", state: "app.press", suboptions: []},
    		mediakit:{name: "Media Kit", group: "News & Media", state: "app.mediakit", suboptions: []},

    		globecourse:{name: "GLOBE Course", group: "Teaching Materials", state: "app.globecourse", suboptions: {
    			globedocuments:{name: "GLOBE Documents", group: "GLOBE", state: "app.globedocuments"},
    			globereadings:{name: "GLOBE Readings", group: "GLOBE", state: "app.globereadings"},
    			globecases:{name: "GLOBE Cases", group: "GLOBE", state: "app.globecases"},
    			globenotes:{name: "GLOBE Notes", group: "GLOBE", state: "app.globenotes"},
    			globepresentations:{name: "GLOBE Presentations", group: "GLOBE", state: "app.globepresentations"}
    		}},
    		cases:{name: "Cases & Teaching Notes", group: "Teaching Materials", state: "app.cases", suboptions: []},
    		notes:{name: "Globalization Notes", group: "Teaching Materials", state: "app.notes", suboptions: []},
    		surveys:{name: "Surveys", group: "Teaching Materials", state: "app.surveys", suboptions: []},
    		other:{name: "Other Teaching Materials", group: "Teaching Materials", state: "app.other", suboptions: []}
 
    	};

    	$scope.groupItems = function(){
    		var items = [];
    		var thisGroup = $scope.entityLabels[$scope.entity].group;

    		for (var item in $scope.entityLabels) {
			    if ($scope.entityLabels.hasOwnProperty(item) && $scope.entityLabels[item].group === thisGroup) {
			        items.push($scope.entityLabels[item]);
			    }
			}

    		return items;
    	};
    }
  };
});
