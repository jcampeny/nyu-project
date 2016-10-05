
angular.module('app')
    .service('mapVariablesService', function($http, $rootScope, $q){
        var popUpIsOpen = false;

        var json = {};
        json.country = {
            "Individual Countries" : [
                // {"iso": "AFG","name": "Afghanistan"},
                // {"iso": "ALA","name": "Åland Islands"},
                {"iso": "ALB","name": "Albania"},
                // {"iso": "DZA","name": "Algeria"},
                // {"iso": "ASM","name": "American Samoa"},
                // {"iso": "AND","name": "Andorra"},
                {"iso": "AGO","name": "Angola"},
                // {"iso": "AIA","name": "Anguilla"},
                // {"iso": "ATG","name": "Antigua and Barbuda"},
                {"iso": "ARG","name": "Argentina"},
                {"iso": "ARM","name": "Armenia"},
                // {"iso": "ABW","name": "Aruba"},
                {"iso": "AUS","name": "Australia"},
                {"iso": "AUT","name": "Austria"},
                {"iso": "AZE","name": "Azerbaijan"},
                // {"iso": "BHS","name": "Bahamas"},
                {"iso": "BHR","name": "Bahrain"},
                {"iso": "BGD","name": "Bangladesh"},
                {"iso": "BRB","name": "Barbados"},
                {"iso": "BLR","name": "Belarus"},
                {"iso": "BEL","name": "Belgium"},
                // {"iso": "BLZ","name": "Belize"},
                {"iso": "BEN","name": "Benin"},
                // {"iso": "BMU","name": "Bermuda"},
                // {"iso": "BTN","name": "Bhutan"},
                {"iso": "BOL","name": "Bolivia (Plurinational State of)"},
                // {"iso": "BES","name": "Bonaire"},
                {"iso": "BIH","name": "Bosnia and Herzegovina"},
                {"iso": "BWA","name": "Botswana"},
                {"iso": "BRA","name": "Brazil"},
                // {"iso": "IOT","name": "British Indian Ocean Territory"},
                // {"iso": "VGB","name": "British Virgin Islands"},
                {"iso": "BRN","name": "Brunei Darussalam"},
                {"iso": "BGR","name": "Bulgaria"},
                {"iso": "BFA","name": "Burkina Faso"},
                // {"iso": "BDI","name": "Burundi"},
                {"iso": "KHM","name": "Cambodia"},
                {"iso": "CMR","name": "Cameroon"},
                {"iso": "CAN","name": "Canada"},
                // {"iso": "CPV","name": "Cabo Verde"},
                // {"iso": "CYM","name": "Cayman Islands"},
                // {"iso": "CAF","name": "Central African Republic"},
                // {"iso": "TCD","name": "Chad"},
                {"iso": "CHL","name": "Chile"},
                {"iso": "CHN","name": "China"},
                // {"iso": "CXR","name": "Christmas Island"},
                // {"iso": "CCK","name": "Cocos (Keeling) Islands"},
                {"iso": "COL","name": "Colombia"},
                // {"iso": "COM","name": "Comoros"},
                {"iso": "COG","name": "Congo"},
                // {"iso": "COK","name": "Cook Islands"},
                {"iso": "CRI","name": "Costa Rica"},
                {"iso": "CIV","name": "Cote d'Ivoire"},
                {"iso": "HRV","name": "Croatia"},
                // {"iso": "CUB","name": "Cuba"},
                // {"iso": "CUW","name": "Curaçao"},
                {"iso": "CYP","name": "Cyprus"},
                {"iso": "CZE","name": "Czechia"},
                // {"iso": "COD","name": "Democratic Republic of the Congo"},
                {"iso": "DNK","name": "Denmark"},
                // {"iso": "DJI","name": "Djibouti"},
                // {"iso": "DMA","name": "Dominica"},
                {"iso": "DOM","name": "Dominican Republic"},
                {"iso": "ECU","name": "Ecuador"},
                // {"iso": "EGY","name": "Egypt"},
                {"iso": "SLV","name": "El Salvador"},
                // {"iso": "GNQ","name": "Equatorial Guinea"},
                // {"iso": "ERI","name": "Eritrea"},
                {"iso": "EST","name": "Estonia"},
                {"iso": "ETH","name": "Ethiopia"},
                // {"iso": "FLK","name": "Falkland Islands (Malvinas)"},
                // {"iso": "FRO","name": "Faeroe Islands"},
                // {"iso": "FJI","name": "Fiji"},
                {"iso": "FIN","name": "Finland"},
                {"iso": "FRA","name": "France"},
                // {"iso": "GUF","name": "French Guiana"},
                // {"iso": "PYF","name": "French Polynesia"},
                // {"iso": "ATF","name": "French Southern and Antarctic Lands"},
                // {"iso": "GAB","name": "Gabon"},
                {"iso": "GMB","name": "Gambia"},
                {"iso": "GEO","name": "Georgia"},
                {"iso": "DEU","name": "Germany"},
                {"iso": "GHA","name": "Ghana"},
                // {"iso": "GIB","name": "Gibraltar"},
                {"iso": "GRC","name": "Greece"},
                // {"iso": "GRL","name": "Greenland"},
                // {"iso": "GRD","name": "Grenada"},
                // {"iso": "GLP","name": "Guadeloupe"},
                // {"iso": "GUM","name": "Guam"},
                {"iso": "GTM","name": "Guatemala"},
                // {"iso": "GGY","name": "Guernsey"},
                {"iso": "GIN","name": "Guinea"},
                // {"iso": "GNB","name": "Guinea-Bissau"},
                {"iso": "GUY","name": "Guyana"},
                // {"iso": "HTI","name": "Haiti"},
                // {"iso": "VAT","name": "Holy See"},
                {"iso": "HND","name": "Honduras"},
                {"iso": "HKG","name": "Hong Kong"},
                {"iso": "HUN","name": "Hungary"},
                {"iso": "ISL","name": "Iceland"},
                {"iso": "IND","name": "India"},
                {"iso": "IDN","name": "Indonesia"},
                {"iso": "IRN","name": "Iran"},
                // {"iso": "IRQ","name": "Iraq"},
                {"iso": "IRL","name": "Ireland"},
                // {"iso": "IMN","name": "Isle of Man"},
                {"iso": "ISR","name": "Israel"},
                {"iso": "ITA","name": "Italy"},
                {"iso": "JAM","name": "Jamaica"},
                {"iso": "JPN","name": "Japan"},
                // {"iso": "JEY","name": "Jersey"},
                {"iso": "JOR","name": "Jordan"},
                {"iso": "KAZ","name": "Kazakhstan"},
                {"iso": "KEN","name": "Kenya"},
                // {"iso": "KIR","name": "Kiribati"},
                // {"iso": "PRK","name": "Korea"},
                {"iso": "KOR","name": "Korea"},
                {"iso": "KWT","name": "Kuwait"},
                {"iso": "KGZ","name": "Kyrgyzstan"},
                {"iso": "LAO","name": "Lao People's Democratic Republic"},
                {"iso": "LVA","name": "Latvia"},
                {"iso": "LBN","name": "Lebanon"},
                // {"iso": "LSO","name": "Lesotho"},
                // {"iso": "LBR","name": "Liberia"},
                // {"iso": "LBY","name": "Libya"},
                // {"iso": "LIE","name": "Liechtenstein"},
                {"iso": "LTU","name": "Lithuania"},
                {"iso": "LUX","name": "Luxembourg"},
                {"iso": "MAC","name": "Macau"},
                {"iso": "MKD","name": "Macedonia"},
                {"iso": "MDG","name": "Madagascar"},
                // {"iso": "MWI","name": "Malawi"},
                {"iso": "MYS","name": "Malaysia"},
                // {"iso": "MDV","name": "Maldives"},
                {"iso": "MLI","name": "Mali"},
                {"iso": "MLT","name": "Malta"},
                // {"iso": "MHL","name": "Marshall Islands"},
                // {"iso": "MTQ","name": "Martinique"},
                // {"iso": "MRT","name": "Mauritania"},
                {"iso": "MUS","name": "Mauritius"},
                // {"iso": "MYT","name": "Mayotte"},
                {"iso": "MEX","name": "Mexico"},
                // {"iso": "FSM","name": "Micronesia"},
                {"iso": "MDA","name": "Moldova"},
                // {"iso": "MCO","name": "Monaco"},
                {"iso": "MNG","name": "Mongolia"},
                {"iso": "MNE","name": "Montenegro"},
                // {"iso": "MSR","name": "Montserrat"},
                {"iso": "MAR","name": "Morocco"},
                {"iso": "MOZ","name": "Mozambique"},
                {"iso": "MMR","name": "Myanmar"},
                // {"iso": "NAM","name": "Namibia"},
                // {"iso": "NRU","name": "Nauru"},
                {"iso": "NPL","name": "Nepal"},
                {"iso": "NLD","name": "Netherlands"},
                // {"iso": "ANT","name": "Netherlands Antilles"},
                // {"iso": "NCL","name": "New Caledonia"},
                {"iso": "NZL","name": "New Zealand"},
                {"iso": "NIC","name": "Nicaragua"},
                {"iso": "NER","name": "Niger"},
                {"iso": "NGA","name": "Nigeria"},
                // {"iso": "NIU","name": "Niue"},
                // {"iso": "NFK","name": "Norfolk Island"},
                // {"iso": "MNP","name": "Northern Mariana Islands"},
                {"iso": "NOR","name": "Norway"},
                {"iso": "OMN","name": "Oman"},
                {"iso": "PAK","name": "Pakistan"},
                // {"iso": "PLW","name": "Palau"},
                {"iso": "PAN","name": "Panama"},
                // {"iso": "PNG","name": "Papua New Guinea"},
                {"iso": "PRY","name": "Paraguay"},
                {"iso": "PER","name": "Peru"},
                {"iso": "PHL","name": "Philippines"},
                // {"iso": "PCN","name": "Pitcairn Islands"},
                {"iso": "POL","name": "Poland"},
                {"iso": "PRT","name": "Portugal"},
                // {"iso": "PRI","name": "Puerto Rico"},
                {"iso": "QAT","name": "Qatar"},
                // {"iso": "REU","name": "Réunion"},
                {"iso": "ROU","name": "Romania"},
                {"iso": "RUS","name": "Russian Federation"},
                // {"iso": "RWA","name": "Rwanda"},
                // {"iso": "BLM","name": "Saint-Barthélemy"},
                // {"iso": "SHN","name": "Saint Helena"},
                // {"iso": "MAF","name": "Saint Martin (French part)"},
                // {"iso": "SPM","name": "Saint Pierre and Miquelon"},
                // {"iso": "WSM","name": "Samoa"},
                // {"iso": "SMR","name": "San Marino"},
                // {"iso": "STP","name": "Sao Tome and Principe"},
                {"iso": "SAU","name": "Saudi Arabia"},
                {"iso": "SEN","name": "Senegal"},
                {"iso": "SRB","name": "Serbia"},
                // {"iso": "SYC","name": "Seychelles"},
                {"iso": "SLE","name": "Sierra Leone"},
                {"iso": "SGP","name": "Singapore"},
                // {"iso": "SXM","name": "Sint Maarten (Dutch part)"},
                {"iso": "SVK","name": "Slovakia"},
                {"iso": "SVN","name": "Slovenia"},
                // {"iso": "SLB","name": "Solomon Islands"},
                // {"iso": "SOM","name": "Somalia"},
                {"iso": "ZAF","name": "South Africa"},
                // {"iso": "SGS","name": "South Georgia and the South Sandwich Islands"},
                // {"iso": "SSD","name": "South Sudan"},
                {"iso": "ESP","name": "Spain"},
                {"iso": "LKA","name": "Sri Lanka"},
                // {"iso": "KNA","name": "St. Kitts and Nevis"},
                // {"iso": "LCA","name": "St. Lucia"},
                // {"iso": "VCT","name": "St. Vincent and the Grenadines"},
                // {"iso": "PSE","name": "State of Palestine"},
                // {"iso": "SDN","name": "Sudan"},
                {"iso": "SUR","name": "Suriname"},
                // {"iso": "SWZ","name": "Swaziland"},
                {"iso": "SWE","name": "Sweden"},
                {"iso": "CHE","name": "Switzerland"},
                // {"iso": "SYR","name": "Syrian Arab Republic"},
                {"iso": "TWN","name": "Taiwan"},
                {"iso": "TJK","name": "Tajikistan"},
                {"iso": "TZA","name": "Tanzania"},
                {"iso": "THA","name": "Thailand"},
                // {"iso": "TLS","name": "Timor-Leste"},
                {"iso": "TGO","name": "Togo"},
                // {"iso": "TKL","name": "Tokelau"},
                // {"iso": "TON","name": "Tonga"},
                {"iso": "TTO","name": "Trinidad and Tobago"},
                {"iso": "TUN","name": "Tunisia"},
                {"iso": "TUR","name": "Turkey"},
                // {"iso": "TKM","name": "Turkmenistan"},
                // {"iso": "TCA","name": "Turks and Caicos Islands"},
                // {"iso": "TUV","name": "Tuvalu"},
                {"iso": "UGA","name": "Uganda"},
                {"iso": "UKR","name": "Ukraine"},
                {"iso": "ARE","name": "United Arab Emirates"},
                {"iso": "GBR","name": "United Kingdom"},
                {"iso": "USA","name": "United States"},
                {"iso": "URY","name": "Uruguay"},
                {"iso": "UZB","name": "Uzbekistan"},
                // {"iso": "VUT","name": "Vanuatu"},
                {"iso": "VEN","name": "Venezuela (Bolivarian Republic of)"},
                {"iso": "VNM","name": "Viet Nam"},
                // {"iso": "VIR","name": "Virgin Islands (U.S.)"},
                // {"iso": "WLF","name": "Wallis and Futuna Islands"},
                // {"iso": "ESH","name": "Western Sahara"},
                {"iso": "YEM","name": "Yemen"},
                {"iso": "ZMB","name": "Zambia"},
                {"iso": "ZWE","name": "Zimbabwe"}
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

        return {
            getData         : getData,
            getCountryISO   : getCountryISO,
            getCountryByISO : getCountryByISO
        };
        function getData(name){
            return json[name];
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
    });
