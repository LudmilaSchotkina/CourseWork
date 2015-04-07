var auctionAppServices = angular.module('auctionAppServices', ['ngResource']);

auctionAppServices.
	factory('CarBrand', function($resource) {
		return $resource('/api/auction-auto/:carBrandId.json', {}, {});
	}).


	factory('Catalog', function($resource) {
		return $resource('/api/catalog-car-parts/all-autos.json', {}, {
		 //query: {method:'GET', isArray:true}
		});
	}).
	factory('AllPartsList', function($resource) {
		return $resource('/api/catalog-car-parts/:carBrandId/models/:modelId.json', {}, {});
		/*
		return{
		    list: function(callback){ 
		    $http.get('/api/catalog-car-parts/:carBrandId/models/:modelId.json').success(callback);
		}
		*/
	}).
	factory('PartType', function($resource) {
		return $resource('/api/catalog-car-parts/:partTypeId.json', {}, {});
	}).
	factory('PartTypeCarBrand', function($resource) {
		return $resource('/api/catalog-car-parts/:partTypeId/:carBrandId/:partTypeId.json', {}, {});
	}).
	factory('PartTypeModelCarBrand', function($resource) {
		return $resource('/api/catalog-car-parts/:partTypeId/:carBrandId/:modelId.json', {}, {});
	}).

	
	factory('Bids', function($resource) {
		return $resource('/api/bids/all-bids.json', {}, {});
	});