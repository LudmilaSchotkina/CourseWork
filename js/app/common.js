goog.provide('autoService.common');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');

goog.require('goog.ui.Popup');
goog.require('goog.ui.Zippy');

goog.require('goog.array');
goog.require('goog.debug.DivConsole');
goog.require('goog.debug.LogManager');
goog.require('goog.events');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuBarRenderer');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Separator');
goog.require('goog.ui.decorate');
goog.require('goog.ui.menuBar');
goog.require('goog.ui.menuBarDecorator');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerScroller');
goog.require('goog.ui.Control');
goog.require('goog.ui.SelectionModel');
goog.require('goog.style');
goog.require('goog.events.FocusHandler');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Prompt');

/** @param {function(Event)}  callback*/
var callback = function(e) {
    var xhr = /** @type {goog.net.XhrIo} */ (e.target);
    if (xhr.getStatus() == 200) {
        alert('OK!');
    } else {
        alert('Oh no, there was a problem!');
    }
};

/** @param {function(Element)} buildTableCars  */
autoService.common.buildTableCars = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.common.listOfCars(jsonobj);
    });
};


/** @param {function(Element)} listOfCars  */
autoService.common.listOfCars = function(jsonobj){
    //var parentElement = 'car-list';
    //var dom = goog.dom.getDomHelper(parentElement);
    //var component = new goog.ui.Component(dom);
    //var component = new goog.ui.Component(goog.dom.getElement('car-list'));

    var tableContainer = new goog.ui.Container();
    //tableContainer.setId('Table Container');

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


/** @param {function(Element)}  buildMenu */
autoService.common.buildMenu = function(rootNode) {
    var menubar = new goog.ui.Component();//goog.ui.menuBar.create();
    var menuNames = ["Home","Auction","Catalog","Body parts", "Engines", "Wheels & tires"];
    var links = ["#/","#/auction/all","#/catalog","#/catalog/body-parts","#/catalog/engines","#/catalog/wheels-tires"];
    var menuOptions = [];

    var listener = function(e) {
        location.href = e.target.idlink;
    };
    //goog.style.setStyle(goog.dom.getElement('menuBarProgrammatic'),"cursor", "default");
    for (i in menuNames) {
        //var menu = new goog.ui.Menu();
        var link = goog.dom.createDom('a',{'href':links[i]}, menuNames[i]);
        //var cont = goog.dom.createDom('p','pcont', link);
        //var btn = new goog.ui.MenuButton(cont, menu,new goog.ui.Css3MenuButtonRenderer());
        
        var btn = new goog.ui.Control(goog.dom.createDom('p','menu-item', link));
        btn.idlink = links[i];
        btn.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
        menubar.addChild(btn, true);
        goog.events.listen(btn, goog.events.EventType.CLICK,listener);
    }     
    menubar.render(goog.dom.getElement('menuBarProgrammatic'));
};
/** @param {function(Element)}  buildCarousel*/
autoService.common.buildCarousel = function(parentElement) {
    /** @param {string} */
    //var link = "http://sftours.redandwhite.com/images/Red-and-White-Fleet-San-Francisco-2062.jpg";
    var dom = goog.dom.getDomHelper(parentElement);
    var component = new goog.ui.Component(dom);
    /*
    var dom = existingComponent.getDomHelper();
    var child = new goog.ui.Component(dom);
    existingComponent.addChild(child, true);
    */
    var link = "/images/carousel/parts.jpg";
    var img = goog.dom.createDom('img',{'class':'carousel','src':link});

    goog.dom.appendChild(parentElement,img);

    component.render(parentElement);


};