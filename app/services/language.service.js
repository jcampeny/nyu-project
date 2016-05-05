function LanguageService($http, $window, $translate) {
    var currentLang = 'es';
    var langsLabes = {'es': "ESP", 'en': "ENG"};

    function getCurrentLang() {
        return currentLang;
    }

    function getCurrentLangLabel() {
        return langsLabes[currentLang];
    }

    function changeLang(lang){
      currentLang = lang;
      $window.localStorage.currentLang = currentLang;
      $http.get("wordpress/"+lang).then(function(){
          $window.location.reload();
      });
    }

    function getLangLabels(){
      return langsLabes;
    }

    if(typeof $window.localStorage.currentLang === "undefined" || $window.localStorage.currentLang === null){
      $window.localStorage.currentLang = currentLang;
    }else{
      currentLang = $window.localStorage.currentLang;
    }
    $translate.use(currentLang);

    return {
        getCurrentLang: getCurrentLang,
        getCurrentLangLabel: getCurrentLangLabel,
        changeLang: changeLang,
        getLangLabels: getLangLabels
    };
}

angular
    .module('app')
    .factory('LanguageService', LanguageService);
