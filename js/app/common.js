goog.provide('autoService.common');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.decorate');
goog.require('goog.ui.Container');
goog.require('goog.ui.Control');
goog.require('goog.style');

/**
 * In common.js described all common functions for the service
*/

/** @param {function(Event)}  callback */
var callback = function(e) {
    var xhr = /** @type {goog.net.XhrIo} */ (e.target);
    if (xhr.getStatus() == 200) {
        alert('OK!');
    } else {
        alert('Oh no, there was a problem!');
    }
};

/**
 * Wrapper function for function listOfCars 
 * @param  {string} url of required json
 */
autoService.common.buildTableCars = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        /** @type {Object}*/
        var jsonobj = xhr.getResponseJson();
        
        autoService.common.listOfCars(jsonobj);
    });
};

/**
 * Renders table of available car brands for auction
 * @param  {Object} jsonobj parsed json
 */
autoService.common.listOfCars = function(jsonobj){
    /** @type {goog.ui.Container} container for table 'Auction'*/
    var listComponent = new goog.ui.Component();
    goog.style.setStyle(goog.dom.getElement('car-list'),"cursor", "default");

    var listener = function(e) {
        //window.history.replaceState("", "Title", "#/auction/"+e.target.idlink);
        document.title = "Auction: " + e.target.idlink;
        var carAuctionTable = goog.dom.getElement('car-auction');
        //carAuctionTable.dispose();
        goog.dom.removeChildren(carAuctionTable);
        autoService.auction.buildTableLots("/api/auction-auto/"+ e.target.idlink +".json"/*, e.target.idlink*/)
    };
    var linkAll = goog.dom.createDom('a',undefined, "All")
    linkAll.idlink = 'all-models';    
    goog.events.listen(linkAll, goog.events.EventType.CLICK, listener);
    listComponent.addChild(new goog.ui.Control(goog.dom.createDom('div','car-list-item', linkAll)),true);

    for(var i in jsonobj){
        var brandLink;
        if(jsonobj[i].modelsAuction.amount==0)
            brandLink = goog.dom.createDom('a','inactive', jsonobj[i].carBrand);
        else {
            brandLink = goog.dom.createDom('a', undefined, jsonobj[i].carBrand);
            goog.events.listen(brandLink, goog.events.EventType.CLICK, listener);
        }

        brandLink.idlink = jsonobj[i].carBrand.toLowerCase();
        divEl = goog.dom.createDom('div','car-list-item',brandLink,
            goog.dom.createDom('span',undefined,jsonobj[i].modelsAuction.amount)
        );
        listComponent.addChild(new goog.ui.Control(divEl),true);
    }
    listComponent.render(goog.dom.getElement('car-list'));
};

/**
 * Renders main menu
 * @param {function()}  buildMenu
 */
autoService.common.buildMenu = function() {
    var menubar = new goog.ui.Component();
    var menuNames = ["Home","Auction","Catalog","Body parts", "Engines", "Wheels & tires"];
    var links = ["#/","#/auction/all-models","#/catalog","#/catalog/body-parts","#/catalog/engines","#/catalog/wheels-tires"];

    for (i in menuNames) {
        var dom = goog.dom.createDom('a',{'href':links[i],'class':'menu-item'}, menuNames[i]);
        dom.id='menu-item-'+i;
        var link = new goog.ui.Control(dom);
        link.idlink = links[i];
        menubar.addChild(link, true);
    }
    menubar.render(goog.dom.getElement('menu-bar'));
};

/** 
 * Decorates carousel to the main page
 * @param {function()}  buildCarousel
 */
autoService.common.buildCarousel = function() {
    var carousel = new gweb.ui.SlidingCarousel(false /* renderNavButtons*/);
    carousel.decorate(goog.dom.getElement('photography-carousel'),undefined, undefined, 3000);
};


function hashHandler(){
    this.oldHash = window.location.hash;
    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.hash){
            var itemIdOld = regExpCheck(that.oldHash);
            that.oldHash = window.location.hash;
            var itemIdNew = regExpCheck(window.location.hash);
            goog.style.setStyle(goog.dom.getElement(itemIdOld), "background","rgb(0,73,105)");
            goog.style.setStyle(goog.dom.getElement(itemIdNew), "background","rgba(16, 22, 45, 0.37)");  
        }
    };
    this.Check = setInterval(function(){ detect() }, 100);
}
function regExpCheck(str){
    var itemId;
    if(/^#\/$/i.test(str))
        itemId = "menu-item-0";
    else if(/(#\/auction).*/i.test(str))
        itemId = "menu-item-1";
    //else if(/(#\/catalog)(\/)?\b(?!body-parts\b)\b(?!engines\b)\b(?!wheels-tires\b)/i.test(str)){
    else if(/^#\/catalog$/i.test(str) || /(#\/catalog\/spares).*/i.test(str))
        itemId = "menu-item-2";
    else if(/(#\/catalog\/body-parts).*/i.test(str))
        itemId = "menu-item-3";
    else if(/(#\/catalog\/engines).*/i.test(str))
        itemId = "menu-item-4";
    else if(/(#\/catalog\/wheels-tires).*/i.test(str))
        itemId = "menu-item-5";

    return itemId;
}
var hashDetection = new hashHandler();