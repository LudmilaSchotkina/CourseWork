var auctionAppCtrls = angular.module('auctionAppCtrls', []);


auctionAppCtrls.controller('MainPageCtrl', ['$scope', '$http',
  function ($scope, $http) {
    autoService.common.buildCarousel();
    
    autoService.bids.buildBidsWinners('/api/bids/winners.json');
    autoService.bids.buildHotBids('/api/bids/featured.json');
    //autoService.bids.listOfHotBids('/api/bids/featured.json');
}]);


auctionAppCtrls.controller('AuctionCtrl', ['$scope', 'AvailableAutosAuction', 'AllModelsAuction',
  function ($scope, AvailableAutosAuction, AllModelsAuction) {
    AllModelsAuction.query(function(data){
      //autoService.common.buildTableCars('/api/auction-auto/all-autos.json');
      autoService.auction.buildTableLots('/api/auction-auto/all-models.json');
    });
    AvailableAutosAuction.query(function(data){
      autoService.common.buildTableCars('/api/auction-auto/all-autos.json');
    });
}]);

auctionAppCtrls.controller('CarBrandAuctionCtrl', ['$scope','$routeParams', 'CarBrand',
  function ($scope,$routeParams, CarBrand) {
    CarBrand.query({carBrandId: $routeParams.carBrandId}, 
    function(data) {
      autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
      //autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
      autoService.auction.listOfLots(data);
    });
  }
]);

auctionAppCtrls.controller('LotCtrl', ['$scope','$routeParams', 'Lot',
  function ($scope,$routeParams, Lot) {
    Lot.query({lotId: $routeParams.lotId}, 
    function(data) {
      autoService.auction.listDescription(data,$routeParams.lotId);
      //autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
      //autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
      //autoService.auction.listOfLots(data);
    });
  }
]);
/*
auctionAppCtrls.controller('CarBrandPageAuctionCtrl', ['$scope','$routeParams', 'CarBrandPage',
  function ($scope,$routeParams, CarBrand) {
    CarBrand.query({
      carBrandId: $routeParams.carBrandId, 
      pageId: $routeParams.pageId
    }, 
    function(data) {
      autoService.common.buildTableCars("/api/auction-auto/all-autos.json");
      //autoService.auction.buildTableLots('/api/auction-auto/'+ $routeParams.carBrandId +'.json',$routeParams.carBrandId);
      autoService.auction.listOfLots(data);
    });
  }
]);
*/
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
      //$scope.data = data;
      //autoService.catalog.listOfModelsForParts("/api/catalog-car-parts/all-autos.json");
      autoService.catalog.listOfCarsForParts(data);
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
/* tmp */
auctionAppCtrls.controller('PartTypeCtrl', ['$scope','$routeParams', 'Catalog', 'PartType', 
  function ($scope, $routeParams, Catalog, PartType) {
    var partType = $routeParams.partTypeId;
    Catalog.query(function(data) {
      //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
      autoService.catalog.buildPartsTypeCars(data,partType);
    });
    PartType.query({partTypeId: $routeParams.partTypeId}, function(data) {
      //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
      autoService.catalog.buildPartsTypeAll(data, $routeParams.partTypeId);
      //autoService.catalog.listOfPartsByType("/api/catalog-car-parts/" + $routeParams.partTypeId + ".json");
    });
  }
]);
auctionAppCtrls.controller('PartTypeCarBrandCtrl', ['$scope','$routeParams', 'Catalog', 'PartTypeCarBrand',
  function ($scope, $routeParams, Catalog, PartTypeCarBrand) {
    
    var partType = $routeParams.partTypeId;
    Catalog.query(function(data) {
      //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
      autoService.catalog.buildPartsTypeCars(data,partType);
    });

    PartTypeCarBrand.query({partTypeId: $routeParams.partTypeId, carBrandId: $routeParams.carBrandId}, 
      function(data) {
        var partType = $routeParams.partTypeId;
        //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
        autoService.catalog.buildPartsTypeCars(data,partType);
        autoService.catalog.listOfPartsByType(
          "/api/catalog-car-parts/" + 
          $routeParams.partTypeId + "/" +
          $routeParams.carBrandId + "/"  + 
          $routeParams.partTypeId + ".json");
      });
    }
]);
auctionAppCtrls.controller('PartTypeModelCtrl', ['$scope','$routeParams', 'Catalog', 'PartTypeModelCarBrand',
  function ($scope, $routeParams, Catalog, PartTypeModelCarBrand) {
     var partType = $routeParams.partTypeId;
    Catalog.query(function(data) {
      //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
      autoService.catalog.buildPartsTypeCars(data,partType);
    });

    PartTypeModelCarBrand.query({
      partTypeId: $routeParams.partTypeId, 
      carBrandId: $routeParams.carBrandId, 
      modelId: $routeParams.modelId
    }, 

      function(data) {
        var partType = $routeParams.partTypeId;
        //autoService.catalog.listOfPartsTypeCars("/api/catalog-car-parts/all-autos.json");
        autoService.catalog.buildPartsTypeCars(data,partType);
        autoService.catalog.listOfPartsByType(
          "/api/catalog-car-parts/" + 
          $routeParams.partTypeId + "/" +
          $routeParams.carBrandId + "/" +
          $routeParams.modelId + ".json");
      });
    }
]);