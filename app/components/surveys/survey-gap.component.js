angular.module('app').directive('nyuGapsurvey', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/survey-gap.html',
    controllerAs: 'nyuGapsurvey',
    controller: function ($scope) {
    	$scope.questions = [
    		{question: "I speak multiple languages.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I have lived in countries other than my home country.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I enjoy traveling to and getting to know people from different parts of the world.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "Some of my closest friends are of nationalities different from mine.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I think I would enjoy working in a country in which I haven't previously lived.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "When I travel/live in another country I try to learn about the political, legal, economic, etc., institutions of that country—and how they differ from my own.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "When I travel/live in another country, I try to learn about the cultural traditions of that country—and how they differ from my own.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I think I can develop an opinion about a person independent of any preconceived image of his/her national culture or religion.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I am comfortable working with people located in different countries.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I am comfortable working together with people from different cultures and backgrounds in the same location as me.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I understand the socioeconomic/political ramifications of world events and can evaluate how they might affect my business or investments.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I read newspapers and magazines with significant international content (e.g., International Herald Tribune, Economist, Fortune).", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I listen to the world news on international TV channels (e.g., CNN International, BBC World Service, Al Jazeera)", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "I have used the Internet to expand my access to international news and commentary.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		},
    		{question: "When I travel/live in another country, I make some attempt to look at local media as well.", type:"select", options:[
    			{id:1,text:"Strongly Disagree"},
    			{id:2,text:"Disagree"},
    			{id:3,text:"Neutral/Not Relevant"},
    			{id:4,text:"Agree"},
    			{id:5,text:"Strongly Agree"}]
    		}
    	];
    }
  };
});
