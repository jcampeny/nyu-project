
angular.module('app')
    .service('mapVariablesService', function($http, $rootScope, $q, DataVaultService){
        var popUpIsOpen = false;
        var defaultCountry = {iso: "USA", name: "United States"};
        var defaultIndicator = {code: "m.exports"};

        var countryAggregateNames = {
            "individual"  : "Individual Countries",
            "region"      : "Region" ,
            "continent"   : "Continent" ,
            "income"      : "Income level" ,
            "development" : "Development level"
        };

        var json = {};
        json.country = {
            "Individual Countries" : [defaultCountry],
            "Region" : [],
            "Continent" : [],
            "Income level" : [],
            "Development level" : []
        };

        json.indicators = {
            "Trade" : {
                "Merchandise Trade" : [{name: 'Exports', "default": true}]
            }
        };

        json.cartogramAvailableIndicators = [
            {name: "Trade" , children: [
                    {name: 'Merchandise Trade', children : [
                            {name: 'Exports', default: true, code: "m.exports", filePrefix: "Exports"},
                            {name: 'Imports', default: false, code: "m.imports", filePrefix: "MerchImports"}
                        ]
                    },
                ]
            }
        ];

        json.years = {
            start : '2015',
            end : '2015'
        };

        json.colorByClassification = [
            {name : 'Region',                    id : 'region'},
            {name : 'Continent',                 id : 'continent'},
            {name : 'Income Level (World Bank)', id : 'income'},
            {name : 'Development Level (IMF)',   id : 'development'}
        ];

        json.indicatorsOther = [{name: "Merchandise exports", code: "m.exports"}];

        json.yearsOther = {
            start : '2015',
            end : '2015'
        };


        DataVaultService.getCountries().then(function(result){
            var countries = result.data.content;

            for(var countryType in countries){
                countries[countryType].sort(function(a,b){
                    if(a.name > b.name) return 1;
                    if(b.name > a.name) return -1;
                    return 0;
                });
            }

            json.country = {
                "Individual Countries" : countries.individual
                // "Region"               : result.data.content.region,
                // "Continent"            : result.data.content.continent,
                // "Income level"         : result.data.content.income,
                // "Development level"    : result.data.content.development
            };
        });

        function loadIndicatorsOther(iso){
            DataVaultService.getCartogramIndicators(iso).then(function(result){
                json.indicatorsOther = result.data.content;
            });
        }
        loadIndicatorsOther(defaultCountry.iso);

        function loadYearOther(code, iso){
            DataVaultService.getCartogramYears(code, iso).then(function(result){
                json.yearsOther = result.data.content;
            });
        }
        loadYearOther(defaultIndicator.code, defaultCountry.iso);

        function loadCartogramAvailableIndicators(){
            DataVaultService.getCartogramAvailableIndicators().then(function(result){
                json.cartogramAvailableIndicators = result.data.content;
            });
        }
        loadCartogramAvailableIndicators();
        
        function getData(name,subname){
            if(!subname){
                return json[name];    
            }else{
                return json[name][subname];
            }
            
        }

        function getCountryByISO(iso){
            var country = null;

            angular.forEach(json.country["Individual Countries"],function(c){
                if(c.iso === iso){
                    country = c;
                }
            });

            return country;
        }
        function getCountryISO(name){
            var iso = null;

            angular.forEach(json.country["Individual Countries"],function(c){
                if(c.name === name){
                    iso = c.iso;
                }
            });

            return iso;
        }

        function getCountryAggregateName(agg){
            return countryAggregateNames[agg];
        }

        function getIndicatorOtherByCode(code){
            var indicator = null;

            angular.forEach(json.indicatorsOther, function(i){
                angular.forEach(i.children,function(ic){
                    if(ic.code === code){
                        indicator = ic;
                    }    
                });
            });

            return indicator;
        }

        return {
            getData                 : getData,
            getCountryISO           : getCountryISO,
            getCountryByISO         : getCountryByISO,
            getCountryAggregateName : getCountryAggregateName,
            getIndicatorOtherByCode : getIndicatorOtherByCode
        };
    });
