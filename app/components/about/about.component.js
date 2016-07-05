angular.module('app').directive('nyuAbout', function () {
  return {
    restrict: 'E',
    templateUrl: '../app/components/about/about.html',
    controllerAs: 'nyuAbout',
    controller: function ($scope, PopupService, DataService) {
    	$scope.collapsedText = true;

        var slug = 'about';
        $scope.content = '';
        $scope.excerpt = '';
        DataService.all('pages', '', '', false, '?slug='+slug).then(function(page){
            console.log(page);
            $scope.content = page[0].content;
            $scope.excerpt = page[0].excerpt.rendered;
        });

    	$scope.showSpeakerPopup = function(){
  			PopupService.openPopUp(true);

        if( navigator.userAgent.match(/iPhone|iPad|iPod/i) ) {
            $('.modal').on('show.bs.modal', function() {
                // Position modal absolute and bump it down to the scrollPosition
                $(this)
                    .css({
                        position: 'absolute',
                        marginTop: $(window).scrollTop() + 'px',
                        bottom: 'auto'
                    });
                // Position backdrop absolute and make it span the entire page
                //
                // Also dirty, but we need to tap into the backdrop after Boostrap 
                // positions it but before transitions finish.
                //
                setTimeout( function() {
                    $('.modal-backdrop').css({
                        position: 'absolute', 
                        top: 0, 
                        left: 0,
                        width: '100%',
                        height: Math.max(
                            document.body.scrollHeight, document.documentElement.scrollHeight,
                            document.body.offsetHeight, document.documentElement.offsetHeight,
                            document.body.clientHeight, document.documentElement.clientHeight
                        ) + 'px'
                    });
                }, 0);
            });
        }
		  };
    }
  };
});
