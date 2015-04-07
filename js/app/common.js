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
    var tableContainer = new goog.ui.Container();
    var tableHeader = new goog.ui.Control(
        goog.dom.createDom('table',"table table-bordered table-hover",
            goog.dom.createDom('thead',undefined,
                goog.dom.createDom('tr',undefined,
                    goog.dom.createDom('th',undefined, "Car brand"),
                    goog.dom.createDom('th',undefined, "Available")
                    )
            )
        )
    );
    goog.style.setStyle(goog.dom.getElement('car-list'),"cursor", "default");
    

    var tbody = goog.dom.createDom('tbody',undefined);
    var listener = function(e) {
        location.href = "#/auction/"+e.target.idlink;
    };

    var allLink = goog.dom.createDom('a',undefined, "All");
    var tr = goog.dom.createDom('tr',undefined,
                goog.dom.createDom('td',undefined,allLink),
                goog.dom.createDom('td',undefined)
        );
    
    allLink.idlink = 'all';
    goog.events.listen(allLink, goog.events.EventType.CLICK, listener);
    goog.dom.appendChild(tbody,tr);
    for(var i in jsonobj){
        //var btn = goog.dom.createDom('button',{'type':'submit'}, "Learn more..");
        var brandLink = goog.dom.createDom('a',undefined, jsonobj[i].car_brand);
        brandLink.idlink = jsonobj[i].car_brand.toLowerCase();
        tr = goog.dom.createDom('tr',undefined,
                goog.dom.createDom('td',undefined,brandLink),
                goog.dom.createDom('td',undefined,jsonobj[i].amount)
        );
        goog.dom.appendChild(tbody,tr);
        goog.events.listen(brandLink, goog.events.EventType.CLICK, listener);
    }
   
    var ttbody = new goog.ui.Control(tbody);
    tableHeader.addChild(ttbody,true);
    tableContainer.addChild(tableHeader,true);
    tableContainer.render(goog.dom.getElement('car-list'));
};

/**
 * Renders main menu
 * @param {function()}  buildMenu
 */
autoService.common.buildMenu = function() {
    var menubar = new goog.ui.Component();//goog.ui.menuBar.create();
    var menuNames = ["Home","Auction","Catalog","Body parts", "Engines", "Wheels & tires"];
    var links = ["#/","#/auction/all","#/catalog","#/catalog/body-parts","#/catalog/engines","#/catalog/wheels-tires"];
    var menuOptions = [];

    var prev;
    var listener = function(e) {
        var el = goog.dom.getElement(e.target.id);
        goog.style.setStyle(el, "background", "rgba(16, 22, 45, 0.37)");  
        if(prev!=null)
            goog.style.setStyle(prev, "background", "rgb(0,73,105)"); 
        prev=el;
    };

    for (i in menuNames) {
        var dom = goog.dom.createDom('a',{'href':links[i],'class':'menu-item'}, menuNames[i]);
       dom.id='menu-item-'+i;
        var link = new goog.ui.Control(dom);
        link.idlink = links[i];
        menubar.addChild(link, true);
        dom.st='0';
        goog.events.listen(dom, goog.events.EventType.CLICK,listener);
        link.render(goog.dom.getElement('menu-bar'));
    }
    //menubar.render(goog.dom.getElement('menu-bar'));

};

/** 
 * Decorates carousel to the main page
 * @param {function()}  buildCarousel
 */
autoService.common.buildCarousel = function() {
    var carousel = new gweb.ui.SlidingCarousel(false /* renderNavButtons*/);
    carousel.decorate(goog.dom.getElement('photography-carousel'),undefined, undefined, 3000);
};