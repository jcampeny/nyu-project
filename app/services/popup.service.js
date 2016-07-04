/*
function PopupService($uibModal) {
    function showSpeakerPopup() {
        var modalInstance = $uibModal.open({
          templateUrl: '../app/components/request-popup/request-popup.html',
          controller: 'nyuRequestPopup',
          size: 'fs'
        });
    }

    return {
        showSpeakerPopup: showSpeakerPopup
    };
}

angular
    .module('app')
    .factory('PopupService', PopupService);
*/
angular.module('app')
    .service('PopupService', function($http, $rootScope, $q){
        var popUpIsOpen = false;
        return {
            openPopUp : openPopUp
        };
        function openPopUp(newState) {
            popUpIsOpen = newState;
            $rootScope.$broadcast('openPopUp', {
                state: popUpIsOpen
            });
        }
    });
