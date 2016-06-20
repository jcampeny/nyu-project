angular.module('app')
.controller('nyuRequestPopup', function ($scope, $uibModalInstance) {
	$scope.close = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
