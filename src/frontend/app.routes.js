myApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/home', {
                 templateUrl: 'components/home/home.tpl.html',
             }).
             when('/about-us', {
                 templateUrl: 'components/about-us/about-us.tpl.html',
             }).
             otherwise({
                 redirectTo: '/'
             });
    }]);
