var auctionApp = angular.module('auctionApp', [
  'ngRoute',
  'auctionAppCtrls',
  'auctionAppServices'
]);

auctionApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/main.html',
        controller: 'MainPageCtrl'
      }).
      when('/auction/all', {
        templateUrl: '/partials/auction.html',
        controller: 'AuctionCtrl'
      }).
      when('/auction/:carBrandId', {
        templateUrl: 'partials/auction.html',
        controller: 'CarBrandAuctionCtrl'
      }).
      when('/auction/:carBrandId/:modelId', {
        templateUrl: 'partials/autos-list.html',
        controller: 'ModelAuctionCtrl'
      }).


      
      when('/catalog', {                        //list of all autos with zipped models
        templateUrl: '/partials/catalog.html',
        controller: 'CatalogCtrl'
      }).
      /*
      when('/catalog/auto/:carBrandId', {
        templateUrl: 'partials/catalog.html',
        controller: 'CarBrandCatalogCtrl'
      }).
      */
      when('/catalog/spares/:carBrandId/:modelId', { //list of all spares for the model
        templateUrl: 'partials/catalog/all-parts.html',
        controller: 'ModelCatalogCtrl'
      }).
      /*
      when('/catalog/spare/:partTypeId', {
        templateUrl: 'partials/catalog.html',
        controller: 'PartTypeCtrl'
      }).
*/
      when('/catalog/:partTypeId', { //ex: /catalog/engine - list of available autos (with parts) and some other info
        templateUrl: 'partials/catalog/part-type.html',
        controller: 'PartTypeCtrl'
      }).
      when('/catalog/:partTypeId/:carBrandId', { //ex: /catalog/engine/audi - all engines for audi
        templateUrl: 'partials/catalog/part-type.html',
        controller: 'PartTypeCarBrandCtrl'
      }).
      when('/catalog/:partTypeId/:carBrandId/:modelId', { //ex: /catalog/engine/audi/a5 - all engines for audi model a5
        templateUrl: 'partials/catalog/part-type.html',
        controller: 'PartTypeModelCtrl'
      }).
      when('/catalog/:partTypeId/:carBrandId/:modelId/:partId', { //ex: /catalog/engine/audi/a5/1242 - info about the engine 1242
        templateUrl: 'partials/catalog/part-id.html',
        controller: 'PartTypePartIdCtrl'
      }).
      
      when('/bids', {
        templateUrl: '/partials/bids.html',
        controller: 'BidsCtrl'
      }).
      when('/bids/winners', {
        templateUrl: '/partials/winners.html',
        controller: 'WinnersCtrl'
      }).
      when('/login', {
        templateUrl: '/partials/login.html',
        controller: 'LoginCtrl'
      }).
      when('/registration', {
        templateUrl: '/partials/login.html',
        controller: 'RegCtrl'
      }).

      when('/about', {
        templateUrl: '/partials/about.html',
        controller: 'RegCtrl'
      }).
      
      otherwise({
        redirectTo: '/'
      });

      // use the HTML5 History API
      //$locationProvider.html5Mode(true);
  }]);