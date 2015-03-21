goog.provide('autoService.catalog');
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


/** @param {function(Element)} listOfModelsForParts  */
autoService.catalog.listOfModelsForParts = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.catalog.listOfCarsForParts(jsonobj);
    });
};
/** @param {function(Element)} listOfCarsForParts  */
autoService.catalog.listOfCarsForParts = function(jsonobj){
    var carList = goog.dom.getElement('car-list');
    var domHelper = goog.dom.getDomHelper('car-list');
    var allCarsContainer = new goog.ui.Component(domHelper/*goog.dom.createDom('div',{'class':'all-cars-for-parts'})*/);
    //allCarsContainer.createDom();
    var width = carList.offsetWidth;
    
    var listener = function(e) {
    };

    for(var i in jsonobj){
        var logo = goog.dom.createDom('div',{'class':'car-logo'},
            goog.dom.createDom('img',{'src':jsonobj[i].logo, 'width':'26px'})
            );

        var link = goog.dom.createDom('a',{'margin':'5px'}, jsonobj[i].car_brand);
        var divBrand = goog.dom.createDom('div','div-brand', logo,link);
        var divBrandControl = new goog.ui.Control(divBrand);

        //var allModels = new goog.ui.Control(goog.dom.createDom('div',''));
        var allModels = goog.dom.createDom('div','zippy-models');
        goog.style.setSize(divBrand, width, 'auto');
        goog.style.setSize(allModels, width,'auto');

        for(var j in jsonobj[i].models){
            //var model = new goog.ui.Control(goog.dom.createDom('span','model-zippy',jsonobj[i].models[j]));
            var tmpLink = '#/catalog/spares/' + jsonobj[i].car_brand.toLowerCase() + '/' + jsonobj[i].models[j];
            var model = goog.dom.createDom('a',{'class':'model-zippy','href': tmpLink},jsonobj[i].models[j]);
            goog.dom.appendChild(allModels,model);
            //allModels.addChild(model,true);
        }
        var divContainer = new goog.ui.Control(goog.dom.createDom('div',undefined/*{'class':'div-brand-models'}*/));
        
        var allModelsControl = new goog.ui.Control(allModels);
        divContainer.addChild(divBrandControl,true);
        divContainer.addChild(allModelsControl,true);
        var zippy = new goog.ui.Zippy(divBrand, allModels,false);
        //goog.events.listen(zippy, goog.events.EventType.CLICK, logEvent);
        allCarsContainer.addChild(divContainer,true);
    }
    allCarsContainer.render(carList);
};


/** @param {function(Element)} buildTableCarParts  */
autoService.catalog.buildTableCarParts = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.catalog.listOfParts(jsonobj);
        autoService.catalog.buildNavMenu();
    });
};

autoService.catalog.buildNavMenu = function(){
    var navMenu = goog.dom.getElement('nav-menu');
    var url = window.location.href;
    var arr = url.split("/");
    var brand = arr[arr.length-2];
    var model = arr[arr.length-1];
//alert(arr);
    var menu = new goog.ui.Control(
        goog.dom.createDom('div',undefined,
            goog.dom.createDom('a',{'href': '#/'},"Home"),
            " > ",
            goog.dom.createDom('a',{'href': '#/catalog'},"Catalog"),
            " > ",
            goog.dom.createDom('a',undefined, brand + ' ' + model)
            )
        );
    menu.render(navMenu);
}

/** @param {function(Element)} listOfParts  */
autoService.catalog.listOfParts = function(jsonobj){
    
    
    var tbody = goog.dom.createDom('tbody',undefined);

    var makeRequestListener = function(e) {
        var id = e.target.idfield;
        var usernameValue;
        var betValue;
        var orderFormElement = goog.dom.getElement('info-order');

        for(var i = 0; i < orderFormElement.length; ++i){
            if(orderFormElement.elements[i].name == 'username')
                usernameValue = orderFormElement.elements[i].value;
            else if(orderFormElement.elements[i].name == 'bet')
                betValue = orderFormElement.elements[i].value;
        }
        /*
        var length = jsonobj[id].bid.length - 1;
        jsonobj[id].bid[length].username = usernameValue;
        jsonobj[id].bid[length].rate = betValue;
        var postData = JSON.stringify(jsonobj);
        goog.net.XhrIo.send('/api/auction-auto/all-models.json', callback, 'POST', postData);
        alert(usernameValue + ': ' + betValue);
        */
       alert("ok");
    }

    var listener = function(e) {
        var dialogComponent = new goog.ui.Component();
 
        var spanInfo = goog.dom.createDom('span',undefined, "Request the price");
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Make a request");
        buttonDom.idfield = id;
        goog.events.listen(buttonDom, goog.events.EventType.CLICK,makeRequestListener);

        var makeBetForm = new goog.ui.Control(
                goog.dom.createDom('form',{'id':'info-order','class':'info-bet'/*,'name':'betForm','method':'post', 'action':'controller'*/},
                    spanInfo,
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'username','value':'','placeholder':'Enter your name'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'username','value':'','placeholder':'Enter your e-mail'})
                    ),
                    goog.dom.createDom('p',undefined,
                        buttonDom
                    )
                )
            );
        makeBetForm.setAllowTextSelection(true); //recursively ??
        var betInfo = new goog.ui.Control();
        betInfo.addChild(makeBetForm,true);
        dialogComponent.addChild(betInfo,true);
        betInfo.setAllowTextSelection(true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
       // dialog1.setAutoHide(true);
        dialog1.setDraggable(false);
        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        dialog1.setVisible(true);  
    };

    for(var i in jsonobj){
        var makeOrder = goog.dom.createDom('button',{'type':'submit', 'class': 'button-more'}, "Price request");
        var tr = goog.dom.createDom('tr',undefined,
            goog.dom.createDom('td','table-row',jsonobj[i].brand),
            goog.dom.createDom('td','table-row',jsonobj[i].model),
            goog.dom.createDom('td','table-row',jsonobj[i].title),
            goog.dom.createDom('td','table-row',jsonobj[i].price),
            goog.dom.createDom('td','table-row', makeOrder)
        );
        goog.events.listen(makeOrder, goog.events.EventType.CLICK,listener);
        goog.dom.appendChild(tbody,tr);
    }

    var table = new goog.ui.Control(
        goog.dom.createDom('div',{'class':'car-parts'},
            goog.dom.createDom('table',"table table-bordered table-hover",
                goog.dom.createDom('thead',undefined,
                    goog.dom.createDom('tr',undefined,
                        goog.dom.createDom('th',undefined, "Car Brand"),
                        goog.dom.createDom('th',undefined, "Model"),
                        goog.dom.createDom('th',undefined, "Type"),
                        goog.dom.createDom('th',undefined, "Price, $"),
                        goog.dom.createDom('th',undefined, "")
                        )
                ),
                tbody
            )
        )
    ); 
    //var ttbody = new goog.ui.Control(tbody);
    //ttbody.setAllowTextSelection(true);
    //tableHeader.addChild(ttbody,true);
    var tableContainer = new goog.ui.Container();
    tableContainer.addChild(table,true);
    
   /*
   var dom = goog.dom.createDom('p',{'-webkit-user-select': 'text'},"sgdg d dh");
    var tmpel = new goog.ui.Control(dom);
    tmpel.setAllowTextSelection(true);
    
    var tmp = new goog.ui.Container();
    tmp.addChild(tmpel,true);
    tmp.render(goog.dom.getElement('eee'));
    
    //var box2 = new goog.ui.Component();
    //alert(tableContainer.isAllowTextSelection() );
    */
    tableContainer.render(goog.dom.getElement('car-parts'));
    // box2.decorate(goog.dom.getElement('car-parts2'));
    
};



autoService.catalog.buildCarPartsMenu = function(){
    var menubar = goog.ui.menuBar.create();
    var menuNames = ["Body parts","Engines","Wheels & tires"];
    var links = ["#/catalog/body-parts","#/catalog/engines","#/catalog/wheels-tires"];
    var menuOptions = [];

    //var tabBar = new goog.ui.TabBar();
    //tabBar.decorate(goog.dom.getElement('car-parts-menu'));

    var listener = function(e) {
        location.href = e.target.idlink;
    };

    for (i in menuNames) {
        var menu = new goog.ui.Menu();
        var cont = goog.dom.createDom('p','car-parts-menu',menuNames[i]);
        var btn = new goog.ui.MenuButton(cont, menu,new goog.ui.Css3MenuButtonRenderer());
        cont.idlink = links[i];
        btn.setDispatchTransitionEvents(goog.ui.Component.State.ALL, true);
        menubar.addChild(btn, true);
        goog.events.listen(cont, goog.events.EventType.CLICK,listener);
    }     
    menubar.render(goog.dom.getElement('car-parts-menu'));
};
