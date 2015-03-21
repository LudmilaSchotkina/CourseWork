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
	}).
	factory('PartType', function($resource) {
		return $resource('/api/catalog-car-parts/all-autos.json', {}, {});
	}).
	factory('PartTypeCarBrand', function($resource) {
		return $resource('/api/catalog-car-parts/:partTypeId/:carBrandId.json', {}, {});
	}).

	
	factory('Bids', function($resource) {
		return $resource('/api/bids/all-bids.json', {}, {});
	});