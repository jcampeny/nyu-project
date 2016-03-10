describe('User session', function() {
  /*
  var scope, userService, httpBackend, API_CONFIG;
    
  beforeEach(module("fmh"));
  beforeEach(module("userModule"));

  beforeEach(inject(function ($httpBackend, _UserService_, _API_CONFIG_) {
    httpBackend = $httpBackend;
    userService = _UserService_;
    API_CONFIG = _API_CONFIG_;
  
    httpBackend.whenPOST(API_CONFIG.BASE_URL+API_CONFIG.AUTH_URL).respond({
      token: "60a5849eac900d69539d871485333e80b51fa574"
    });
    //Default url requests on routes is called
    httpBackend.whenGET("/app/core/templates/public-home.html").respond({});
    httpBackend.whenGET("/app/social_network/templates/newsfeed.html").respond({});
    httpBackend.whenGET(API_CONFIG.BASE_URL+API_CONFIG.USER_PROFILE_URL+"users/me/").respond({
      "id": 1,
      "url":"http://localhost:8000/api-user-profile/users/1/",
      "username":"cristiam",
      "email":"cristiam86@gmail.com"
    });
  }));

  beforeEach(function() {
      
    // Create mock service
    service = jasmine.createSpyObj('dataService', [ 'call', 'save' ]);
      
    // Create Song controller and inject mocks
    angular.mock.inject(function($rootScope, $controller) {
        
      scope = $rootScope.$new();
      $controller('mainController', {
        $scope: scope,
        dataService: service
      });
    });
  });

  it("karma config works", function() {});

  it("login and logout",function(){
    expect(userService.isUserLogged()).toBeFalsy(); //User not logged

    userService.login().then(function(response){
      expect(window.localStorage['fmh.token']).toBe("60a5849eac900d69539d871485333e80b51fa574"); //Token returned
    });
    httpBackend.flush();

    expect(userService.isUserLogged()).toBeTruthy(); //User logged

    userService.getUserInfo().then(function(response){
      expect(response.url).toBe("http://localhost:8000/api-user-profile/users/1/");
      expect(response.username).toBe("cristiam");
      expect(response.email).toBe("cristiam86@gmail.com");
    });
    httpBackend.flush();

    var user = userService.getUser();
    expect(user.url).toBe("http://localhost:8000/api-user-profile/users/1/");
    expect(user.username).toBe("cristiam");
    expect(user.email).toBe("cristiam86@gmail.com");

    userService.logout();
    expect(userService.isUserLogged()).toBeFalsy();
  });
  */
}); 