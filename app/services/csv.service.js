angular
    .module('app')
    .service('CsvService', [ '$http', '$q', '$rootScope', function($http, $q, $rootScope){
        return {
            setCSV : setCSV,
            getCSV : getCSV,
            deleteCSV : deleteCSV,
            activeCSV : activeCSV,
            getCSVFromDataImporter : getCSVFromDataImporter           
        };

        function setCSV(user, csv, other){
            var item = {
                user : user,
                csv : csv,
                other : other
            };
            return $http.post('php/woocommerce/set-CSV.php', item);
        }

        function getCSV(user){
            return $http.post('php/woocommerce/get-CSV.php', user);
        }

        function deleteCSV(user, csv){
            var item = {
                user : user,
                csv_id : csv.id
            };
            return $http.post('php/woocommerce/delete-CSV.php', item);
        }
        
        /* Evento que se llama al activar un csv */
        function activeCSV(csv){
            $rootScope.$broadcast('activeCSV', {
                csv : csv
            });
        }

        /****************************
        ***** DATA IMPORTER CSV *****
        ****************************/
        function getCSVFromDataImporter (user) {
            return $http.post('php/woocommerce/get-CSV-data-importer.php', user);
        }
    }]);

