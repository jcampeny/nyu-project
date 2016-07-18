angular.module('app').directive('nyuGapsurvey', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/survey-gap.html',
    controllerAs: 'nyuGapsurvey',
    controller: function ($scope, $timeout, $http) {
        //GET INFO FROM JSONDB
        $scope.avg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var totalGaps = 0;
        var avgGap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $http.get("/wordpress/wp-content/plugins/gap-survey/gap-average.json").then(function(result){
            $scope.avg = result.data.avgPankaj;
            avgGap = result.data.avg;
            totalGaps = result.data.total + 1;
        });
        //
        function getAverage(theArray){
            var s = 0;
            for(var a in theArray){
                if(theArray[a] !== null){
                    s += (+theArray[a]);
                }
            }

            if(s>19){
                $scope.scoreText = "implies no (serious)";
            }else if(s > 9){
                $scope.scoreText = "some gap";
            }else if(s > 0){
                $scope.scoreText = "a significant gap";
            }else{
                $scope.scoreText = "a huge gap";
            }
            return s;
        }

    	$scope.page = "questions";
    	$scope.score = function(){
            return getAverage($scope.answers);
        };
    	$scope.scoreText = "some gap";

    	$scope.showResults = function(){
            console.log($scope.surveyUserData);
			$scope.page = "results";    	
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$timeout(function(){
                var newAvg = [];
                var log = 0;
                //new array avg
                angular.forEach($scope.answers, function(actualAvg){
                    newAvg[log] = avgGap[log] + (actualAvg / totalGaps);
                    newAvg[log] = Math.round(newAvg[log] * 100) / 100;
                    log++;
                });
                var json = {
                    "average" : {
                        "total" : totalGaps,
                        "totalavg" : Math.round(getAverage(newAvg) * 100) / 100,
                        "avg" : newAvg,
                        "avgPankaj" : $scope.avg
                    },
                    "general" :{
                        "user" : {
                            "info" : $scope.surveyUserData,
                            "answers" : $scope.answers                            
                        }                        
                    } 

                    
                };
                $http
                    .post("/wordpress/wp-content/plugins/gap-survey/save-data-gap.php", json)
                    .then(function(response){
                        console.log(response.data);
                    });
			},500);
    	};
        var optionGeneral = [
                {id:1,text:"Strongly Disagree"},
                {id:2,text:"Disagree"},
                {id:3,text:"Neutral/Not Relevant"},
                {id:4,text:"Agree"},
                {id:5,text:"Strongly Agree"}
                ];
    	$scope.questions = [
    		{question: "I speak multiple languages.", type:"select", options: optionGeneral },
    		{question: "I have lived in countries other than my home country.", type:"select", options: optionGeneral },
    		{question: "I enjoy traveling to and getting to know people from different parts of the world.", type:"select", options: optionGeneral },
    		{question: "Some of my closest friends are of nationalities different from mine.", type:"select", options: optionGeneral },
    		{question: "I think I would enjoy working in a country in which I haven't previously lived.", type:"select", options: optionGeneral },
    		{question: "When I travel/live in another country I try to learn about the political, legal, economic, etc., institutions of that country—and how they differ from my own.", type:"select", options: optionGeneral },
    		{question: "When I travel/live in another country, I try to learn about the cultural traditions of that country—and how they differ from my own.", type:"select", options: optionGeneral },
    		{question: "I think I can develop an opinion about a person independent of any preconceived image of his/her national culture or religion.", type:"select", options: optionGeneral },
    		{question: "I am comfortable working with people located in different countries.", type:"select", options: optionGeneral },
    		{question: "I am comfortable working together with people from different cultures and backgrounds in the same location as me.", type:"select", options: optionGeneral },
    		{question: "I understand the socioeconomic/political ramifications of world events and can evaluate how they might affect my business or investments.", type:"select", options: optionGeneral },
    		{question: "I read newspapers and magazines with significant international content (e.g., International Herald Tribune, Economist, Fortune).", type:"select", options: optionGeneral },
    		{question: "I listen to the world news on international TV channels (e.g., CNN International, BBC World Service, Al Jazeera)", type:"select", options: optionGeneral },
    		{question: "I have used the Internet to expand my access to international news and commentary.", type:"select", options: optionGeneral },
    		{question: "When I travel/live in another country, I make some attempt to look at local media as well.", type:"select", options: optionGeneral}
    	];

    	$scope.answers = {
    		q1:  null,
    		q2:  null,
    		q3:  null,
    		q4:  null,
    		q5:  null,
    		q6:  null,
    		q7:  null,
    		q8:  null,
    		q9:  null,
    		q10: null,
    		q11: null,
    		q12: null,
    		q13: null,
    		q14: null,
    		q15: null
    	};

        $scope.surveyUserData = {
            living: null,
            born: null,
            occupation: null,
            age: null,
            gender: null
        };

        $scope.countries = [];
        $http.get("/localdata/content/countries.json").then(function(result){
            $scope.countries = result.data;
        });

        $scope.occupations = [
            {name :"Business / Private Sector", code: "BPS"},
            {name :"Educator / Researcher", code: "EDR"},
            {name :"Government / Non-profit / NGO", code: "GNP"},
            {name :"Student", code: "STD"}
        ];

        $scope.ages = [
            {name: "10 - 19", code: "10"},
            {name: "20 - 29", code: "20"},
            {name: "30 - 39", code: "30"},
            {name: "40 - 49", code: "40"},
            {name: "50 - 59", code: "50"},
            {name: "60 - 69", code: "60"},
            {name: "70 - 79", code: "70"}
        ];
        $scope.genders = [
            {name: "Male", code: "M"},
            {name: "Female", code: "F"}
        ];
    }
  };
});
