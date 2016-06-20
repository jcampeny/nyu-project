
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
