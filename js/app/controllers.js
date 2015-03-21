var auctionAppCtrls = angular.module('auctionAppCtrls', []);


auctionAppCtrls.controller('MainPageCtrl', ['$scope', '$http',
  function ($scope, $http) {
    autoService.common.buildCarousel(goog.dom.getElement('carousel'));
}]);


auctionAppCtrls.controller('AuctionCtrl', ['$scope', '$http',
  function ($scope, $http) {
      autoService.common.buildTableCars('/api/auction-auto/all-autos.json');

      autoService.auction.buildTableLots('/api/auction-auto/all-models.json');

}]);
auctionAppCtrls.controller('CarBrandAuctionCtrl', ['$scope','$routeParams', 'CarBrand',
  function ($scope,$routeParams, CarBrand) {
    CarBrand.query({carBrandId: $routeParams.carBrandId}, function(data) {
      autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
      autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
    });
  }
]);

auctionAppCtrls.controller('BidsCtrl', ['$scope', 'Bids',
  function ($scope, CarBrand) {
    CarBrand.query({carBrandId: $routeParams.carBrandId}, function(data) {
      autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
      autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
    });
  }
]);



auctionAppCtrls.controller('CatalogCtrl', ['$scope', 'Catalog',
  function ($scope, Catalog) {
    Catalog.query(function(data) {
      $scope.data = data;
      autoService.catalog.listOfModelsForParts("/api/catalog-car-parts/all-autos.json");
      //autoService.catalog.listOfCarsForParts($scope.data);

      //autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
    });
  }
]);
auctionAppCtrls.controller('ModelCatalogCtrl', ['$scope','$routeParams', 'AllPartsList',
  function ($scope, $routeParams, AllPartsList) {
    AllPartsList.query({carBrandId: $routeParams.carBrandId, modelId: $routeParams.modelId}, 
      function(data) {
        autoService.catalog.buildTableCarParts("/api/catalog-car-parts/" + $routeParams.carBrandId + "/models/" + $routeParams.modelId + ".json");
    });
  }
]);
auctionAppCtrls.controller('PartTypeCtrl', ['$scope','$routeParams', 'PartType',
  function ($scope, $routeParams, PartType) {
    PartType.query({PartTypeId: $routeParams.PartTypeId}, function(data) {
      autoService.catalog.listOfModelsForParts("/api/catalog-car-parts/all-autos.json");
      //autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
    });
  }
]);
auctionAppCtrls.controller('PartTypeCarBrandCtrl', ['$scope','$routeParams', 'PartTypeCarBrand',
  function ($scope, $routeParams, PartTypeCarBrand) {
    PartTypeCarBrand.query({partTypeId: $routeParams.partTypeId, carBrandId: $routeParams.carBrandId}, 
      function(data) {
        autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
        autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
      });
    }
]);
