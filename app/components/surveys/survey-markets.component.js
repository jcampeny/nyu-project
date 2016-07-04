angular.module('app').directive('nyuMarketssurvey', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/surveys/survey-markets.html',
    controllerAs: 'nyuMarketssurvey',
    controller: function ($scope) {
    	$scope.questions = [
    		{id:"1a", question: "What is your Master degree in?", type: "text", hint:"(Master group)", options:[
    			{id:"a",text:"Business administration"},
    			{id:"b",text:"Finance"},
    			{id:"c",text:"Economics"},
    			{id:"d",text:"Political Science"},
    			{id:"e",text:"Other social sciences / Humanities"},
    			{id:"f",text:"Education, Public administration and services"},
    			{id:"g",text:"Engineering, Mathematics, and Computer sciences"},
    			{id:"h",text:"Health sciences"},
    			{id:"i",text:"Other fields"}]
    		},
    		{id:"1b", question: "What is the major of your bachelor degree?", type:"text", hint:"(Bachelor group)", options:[
    			{id:"a",text:"Business"},
    			{id:"b",text:"Finance"},
    			{id:"c",text:"Economics"},
    			{id:"d",text:"Education"},
    			{id:"e",text:"Art and humanities"},
    			{id:"f",text:"Science, engineering and related fields"},
    			{id:"g",text:"Other"}
    			]
    		},
    		{id:"2", question: "What is your approximate average household income?", type:"text", hint:"", options:[
    			{id:"a",text:"$0 - $24,999"},
    			{id:"b",text:"$25,000-$49,999"},
    			{id:"c",text:"$50,000-$74,999"},
    			{id:"d",text:"$75,000-$124,999"},
    			{id:"e",text:"$125,000-$249,999"},
    			{id:"f",text:"$250,000-$1,599,999"},
    			{id:"g",text:"$1,600,000 and up"}]
    		},
    		{id:"3", question: "Generally speaking, do you usually think of yourself as a Republican, a Democrat, an Independent, or some other category?", type:"text", hint:"", options:[
    			{id:"a",text:"Republican"},
    			{id:"b",text:"Democrat"},
    			{id:"c",text:"Independent"},
    			{id:"d",text:"Other"}]
    		},
    		{id:"4", question: "Have you ever lived outside of the US for a continuous period of at least 12 months?", type:"text", hint:"", options:[
    			{id:"a",text:"Yes"},
    			{id:"b",text:"No"}]
    		},
    		{id:"5", question: "Governments should not intervene in free markets.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"6", question: "Free markets always lead to vigorous competition.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"7", question: "Farsighted companies can be trusted to do well by the environment.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"8", question: "Smart companies can handle risks and market volatility on their own.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"9", question: "Free markets tend to lead to a fair distribution of income.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"10", question: "Globalization is generally good for countries, companies and individuals.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"11", question: "Globalization tends to make industries more concentrated (Reduces the number of competitors in them).", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"12", question: "Globalization is a major contributor to global warming because of transportation-related emissions.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"13", question: "Globalization always enhances risks for countries, companies and individuals.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"14", question: "Globalization is the major cause of rising inequality and decreasing security in the labor market.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"15", question: "Globalization is leading to cultural homogenization.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"16", question: " The world is steadily getting more globalized.", type:"text", hint:"", options:[
    			{id:"a",text:"Strongly Disagree (1)"},
    			{id:"b",text:"Disagree (2)"},
    			{id:"c",text:"Neutral/Not Relevant (3)"},
    			{id:"d",text:"Agree (4)"},
    			{id:"e",text:"Strongly Agree (5)"}]
    		},
    		{id:"17", question: "What percent of all voice calling minutes around the world are international?", type:"percent", hint:"", options:[]
    		},
    		{id:"18", question: "What percent of global economic output is exported (exports as a percentage of world GDP)?", type:"percent", hint:"", options:[]
    		},
    		{id:"19", question: "What percent of global economic output in the creative and cultural industries is exported (exports as a percentage of world total output in such industries)", type:"percent", hint:"", options:[]
    		},
    		{id:"20", question: "What percent of stock market investment is international (invested outside the investor’s home country)?", type:"percent", hint:"", options:[]
    		},
    		{id:"21", question: "What percent of total fixed capital investment around the world is foreign direct investment (meaning a company from one country makes a physical investment in building or buying operations in another country)?", type:"percent", hint:"", options:[]
    		},
    		{id:"22", question: "What percent of the world population are first generation migrants (live outside the country where they were born)?", type:"percent", hint:"", options:[]
    		},
    		{id:"23", question: "What percent of university students study outside their home countries?", type:"percent", hint:"", options:[]
    		},
    		{id:"24", question: "What percent of tourist arrivals worldwide are international (meaning the tourist visits a country different from the country where he or she lives)?", type:"percent", hint:"", options:[]
    		},
    		{id:"25", question: "What percent of all friends on Facebook around the world are international (meaning the two friends are located in different countries)?", type:"percent", hint:"", options:[]
    		},
    		{id:"26", question: "What percent of all Twitter followers around the world are international (meaning the follower is in a different country than the person he or she is following)?", type:"percent", hint:"", options:[]
    		}
    	];
    }
  };
});
