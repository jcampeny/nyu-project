
angular.module('app')
    .service('mapVariablesService', function($http, $rootScope, $q){
        var popUpIsOpen = false;
        return {
            getData : getData
        };
        function getData(name){
            var json = {};
            json.country = {
                "Individual Countries" : [
                    {name : "Germany"},
                    {name : "United States"}
                    // {name : "Albania"},
                    // {name : "Etc."}
                ]
                // "World" : [
                //     {name : "Total, all countries"}
                // ],
                // "Region" : [
                //     {name : "East Asia and Pacific"},
                //     {name : "Europe"},
                //     {name : "Middle East and North Africa"},                
                //     {name : "North America"},
                //     {name : "South and Central America, Caribbean"},
                //     {name : "South and Central Asia"},
                //     {name : "Sub-Saharan Africa"}
                // ],
                // "Continent" : [
                //     {name : "Africa"},
                //     {name : "Asia"},
                //     {name : "Europe"},                
                //     {name : "North America"},
                //     {name : "Oceania"},
                //     {name : "South America"}
                // ],
                // "Income level" : [                
                //     {name : "Low Income"},
                //     {name : "Lower Middle Income"},
                //     {name : "Upper Middle Income"},                
                //     {name : "High Income"}
                // ],
                // "Development level" : [
                //     {name : "Emerging and Developing Economies"},
                //     {name : "Advanced Economies"}
                // ],
                // "Trade blocs" : [
                //     {name : "ASEAN"},
                //     {name : "CARICOM"},
                //     {name : "ECOWAS"},                
                //     {name : "EFTA"},
                //     {name : "European Union"},
                //     {name : "MERCOSUR"},
                //     {name : "NAFTA"},
                //     {name : "SICA"}
                // ],
                // "Regional Groups" : [                
                //     {name : "APEC"},
                //     {name : "African Union"},
                //     {name : "Commonwealth of Nations"},                
                //     {name : "La Francophonie"},
                //     {name : "Organization of American States"}
                // ]
            };

            json.indicators = {
                "Trade" : {
                    "Merchandise Trade" : [
                        {name: 'Exports', default: false}
                        // {name: 'Imports', default: false}
                    ],
                    // "Services Trade" : [
                    //     {name: 'Exports', default: false},
                    //     {name: 'Imports', default: false}
                    // ],
                    // "Test" : [
                    //     {name: 'test', default: false}
                    // ]
                }
                // "Capital" : {
                //     "FDI stocks" : [
                //         {name: 'Outward flows', default: false},
                //         {name: 'Inward flows', default: false}
                //     ],
                //     "FDI flows" : [
                //         {name: 'Outward stocks', default: false},
                //         {name: 'Inward stocks', default: false}
                //     ]
                // }
            };
            json.years = {
                start : '2005',
                end : '2015'
            };
            json.colorByClassification = [
                {name: 'Region', id : 'region'},
                {name: 'Continent', id : 'continent'},
                {name: 'Income Level (World Bank)', id : 'income'},
                {name: 'Development Level (IMF)', id : 'dev'}
            ];
            return json[name];
        }
    });
