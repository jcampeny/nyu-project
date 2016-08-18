angular.module('app').directive('nyuCage', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/cage/cage.html',
    controllerAs: 'nyuCage',
    controller: function ($scope, LoginService, $http, $rootScope) {
        $scope.root = $rootScope;
        $scope.selectedCountry = {
            name : "",
            items : []
        };
        var test = {};
        $http({
          url: 'localdata/content/distance-variables.json',
          method: 'GET'
        }).then(function(response){
            
            angular.forEach(response.data, function(section, key){
                test[key] = {};
                angular.forEach(section, function(subSection){
                    var itemItem = {
                        "classvar": subSection.classvar,
                        "name": subSection.name,
                        "varname": subSection.varname,
                        "default": subSection.default,
                        "value" : 0.125
                    };
                    if(typeof test[key][subSection.source] == "undefined"){
                        test[key][subSection.source] = [];
                    }
                    test[key][subSection.source].push(itemItem);
                });
            });
            $scope.sliderSections = test;
        });

        $scope.sliderSections = {
        	"Cultural" : {
        		"CEPII Language" : [
		        	{
                       "classvar": "clang",
                       "name": "Common official language",
                       "varname": "lang.col",
                       "default": false,
                       "value" : 0.125
                    }
                ],
                "Dow and Karunaratna": [
                    {
                       "classvar": "dkvars",
                       "name": "Same language",
                       "varname": "dk.same_language",
                       "default": false,
                       "value" : 0.125
                    }
                ]
        	}
        };
        $scope.countries = {
            "Individual Countries" : [
                {name : "Afghanistan"},
                {name : "Albania"},
                {name : "Etc."}
            ],
            "World" : [
                {name : "Total, all countries"}
            ],
            "Region" : [
                {name : "East Asia and Pacific"},
                {name : "Europe"},
                {name : "Middle East and North Africa"},                
                {name : "North America"},
                {name : "South and Central America, Caribbean"},
                {name : "South and Central Asia"},
                {name : "Sub-Saharan Africa"}
            ],
            "Continent" : [
                {name : "Africa"},
                {name : "Asia"},
                {name : "Europe"},                
                {name : "North America"},
                {name : "Oceania"},
                {name : "South America"}
            ],
            "Income level" : [                
                {name : "Low Income"},
                {name : "Lower Middle Income"},
                {name : "Upper Middle Income"},                
                {name : "High Income"}
            ],
            "Development level" : [
                {name : "Emerging and Developing Economies"},
                {name : "Advanced Economies"}
            ],
            "Trade blocs" : [
                {name : "ASEAN"},
                {name : "CARICOM"},
                {name : "ECOWAS"},                
                {name : "EFTA"},
                {name : "European Union"},
                {name : "MERCOSUR"},
                {name : "NAFTA"},
                {name : "SICA"}
            ],
            "Regional Groups" : [                
                {name : "APEC"},
                {name : "African Union"},
                {name : "Commonwealth of Nations"},                
                {name : "La Francophonie"},
                {name : "Organization of American States"}
            ]
        };
    }
  };
});
