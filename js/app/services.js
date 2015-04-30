var auctionAppServices = angular.module('auctionAppServices', ['ngResource']);

auctionAppServices.

	factory('AvailableAutosAuction', function($resource) {
		return $resource('/api/auction-auto/all-autos.json', {}, {query: {method:'GET', isArray:true}});
	}).
	factory('AllModelsAuction', function($resource) {
		return $resource('/api/auction-auto/all-models.json', {}, {query: {method:'GET', isArray:true}});
	}).

	factory('CarBrand', function($resource) {
		return $resource('/api/auction-auto/:carBrandId/1.json', {}, {query: {method:'GET', isArray:true}});
	}).
	factory('Lot', function($resource) {
		return $resource('/api/auction-auto/all-models.json', {lotId:'lotid'}, {query: {method:'GET', isArray:true}});
	}).
	/*
	factory('CarBrandPage', function($resource) {
		return $resource('/api/auction-auto/:carBrandId/:pageId.json', {}, {query: {method:'GET', isArray:true}});
	}).
*/

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