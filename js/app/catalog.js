goog.provide('autoService.catalog');
goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.ui.AnimatedZippy');
goog.require('goog.ui.Zippy');
goog.require('goog.ui.ZippyEvent');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.array');
goog.require('goog.ui.decorate');
goog.require('goog.ui.Container');
goog.require('goog.ui.Control');
goog.require('goog.style');
goog.require('goog.ui.Dialog');
//goog.provide('example');
goog.require('autoService.templates');


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

    var anims  = {};
    var open   = null;

    var headersArray = [];
    for(var i in jsonobj){
        var logo = goog.dom.createDom('div',{'class':'car-logo'},
            goog.dom.createDom('img',{'src':jsonobj[i].logo, 'width':'26px'})
            );

        var link = goog.dom.createDom('a',{'margin':'5px'}, jsonobj[i].car_brand);
        var divBrand = goog.dom.createDom('div',{'class':'div-brand','width':'700px'}, logo,link);
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

       // var zippy = new goog.ui.Zippy(divBrand, allModels,false);
        var animation = new goog.ui.AnimatedZippy(divBrand, allModels);
        animation.amount=jsonobj[i].amount;
        animation.animationDuration = 400;
        goog.events.listen(animation, goog.ui.Zippy.Events.TOGGLE, zippyToggle);
        anims[goog.getUid(animation)] = animation;
        
     
        allCarsContainer.addChild(divContainer,true);
    }
    function zippyToggle(event) {
        var uid = goog.getUid(event.target);
        if(event.target.amount!=0){
            if (event.expanded && uid!=open) {
                if (open) {
                    anims[open].animationDuration = 0;
                    anims[open].setExpanded(false);
                    anims[open].animationDuration = 400;
                }
                open = uid;
            }
        } else {
            anims[uid].animationDuration = 0;
            anims[uid].setExpanded(false);
        }
        
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
        //var id = e.target.idfield;
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
        //buttonDom.idfield = id;
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
        //dialog1.setAutoHide(true);
        dialog1.setDraggable(false);
        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        dialog1.setVisible(true);  
    };

    for(var i in jsonobj){
        var makeOrder = goog.dom.createDom('button',{'class':'button-more','type':'submit', 'class':'css-button'}, "Price request");
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
        goog.dom.createDom('div','car-parts',
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
    var tableContainer = new goog.ui.Container();
    tableContainer.addChild(table,true);
    tableContainer.render(goog.dom.getElement('car-parts'));   
};


/*
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
*/

autoService.catalog.listOfPartsTypeCars = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.catalog.buildPartsTypeCars(jsonobj,partType);

    });
};
/*
var say = function(what) {
   what('say function');
}
 
var hello = function (who) {
   alert('Hello '+who);      // выведет "Hello say function"
}
 
say(hello);
 */
autoService.catalog.buildPartsTypeCars = function(jsonobj, partType){
/*
    var message="jbkkj";

    var data = {greeting: message, year: new Date().getFullYear()};
    var html = autoService.templates.welcome(data);
    goog.dom.getElement('hello').innerHTML = html;
    */

    var carList = goog.dom.getElement('car-list');

    var domHelper = goog.dom.getDomHelper('car-list');
    var allCarsContainer = new goog.ui.Component(domHelper/*goog.dom.createDom('div',{'class':'all-cars-for-parts'})*/);
    //allCarsContainer.createDom();
    var width = carList.offsetWidth;
    
    var listener = function(e) {
    };
    var anims={};
    var open = null;
    for(var i in jsonobj ){
        var link = goog.dom.createDom('a',{'margin':'5px'}, jsonobj[i].car_brand, jsonobj[i].amount);
        var divBrand = goog.dom.createDom('div',{'class':'div-brand-parts'}, link);
        var divBrandControl = new goog.ui.Control(divBrand);
        var allModels = goog.dom.createDom('div','zippy-models');
        goog.style.setSize(divBrand, width, 'auto');
        goog.style.setSize(allModels, width,'auto');

        var tmpLink;
        //alert(jsonobj[0].models[0]);
        for(var j in jsonobj[i].models){
            
            if(partType != undefined)
                tmpLink = '#/catalog/' + partType + '/'+ jsonobj[i].car_brand.toLowerCase() + '/' + jsonobj[i].models[j];
            else tmpLink = '#/catalog/' + partType + '/'+ jsonobj[i].car_brand.toLowerCase() + '/' + jsonobj[i].models[j];
            var model = goog.dom.createDom('a',{'class':'model-zippy','href': tmpLink},jsonobj[i].models[j]);
            goog.dom.appendChild(allModels,model);
        }
        var divContainer = new goog.ui.Control(goog.dom.createDom('div',undefined/*{'class':'div-brand-models'}*/));
        
        var allModelsControl = new goog.ui.Control(allModels);
        divContainer.addChild(divBrandControl,true);
        divContainer.addChild(allModelsControl,true);
        //var zippy = new goog.ui.Zippy(divBrand, allModels,false);
        var animation = new goog.ui.AnimatedZippy(divBrand, allModels);
        animation.amount=jsonobj[i].amount;
        animation.animationDuration = 400;
        animation.animationAcceleration = goog.fx.easing.easeOut;
        goog.events.listen(animation, goog.ui.Zippy.Events.TOGGLE, zippyToggle);
        anims[goog.getUid(animation)] = animation;

        //goog.events.listen(zippy, goog.events.EventType.CLICK, logEvent);
        allCarsContainer.addChild(divContainer,true);
    }
    function zippyToggle(event) {
        var uid = goog.getUid(event.target);
        if(event.target.amount!=0){
            if (event.expanded && uid!=open) {
                if (open) {
                    anims[open].animationDuration = 0;
                    anims[open].setExpanded(false);
                    anims[open].animationDuration = 400;
                }
                open = uid;
            }
        } else {
            anims[uid].animationDuration = 0;
            anims[uid].setExpanded(false);
        }
        
    }
    allCarsContainer.render(carList);
};


autoService.catalog.listOfPartsByType = function(url, partType){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.catalog.buildPartsTypeAll(jsonobj, partType);
    });
};
autoService.catalog.buildHeaders = function(partType){
    var catalogHeader = goog.dom.getElement('catalog-header');
    var catalogTitle = goog.dom.getElement('catalog-title');
    var text;
    switch(partType){
        case 'body-parts': 
            text = "Body parts";
            break;
        case 'engines': 
            text = "Engines";
            break;
        case 'wheels-tires': 
            text = "Wheels & tires";
            break;
        default: 
            text = "undefined"; 
            break;
    }
    /*
    var spanHeader = new goog.ui.Control(goog.dom.createDom('span',undefined,text));
    var spanTitle = new goog.ui.Control(goog.dom.createDom('h2',undefined,"Choose " + text));
    catalogHeaderComponent.addChild(spanHeader,true);
    catalogTitleComponent.addChild(spanTitle,true);
    */
    var catalogHeaderComponent = new goog.ui.Control(goog.dom.createDom('span',undefined,text));
    var catalogTitleComponent = new goog.ui.Control(goog.dom.createDom('h2',undefined,"Choose " + text));
    catalogHeaderComponent.render(catalogHeader);
    //catalogTitleComponent.render(catalogTitle);

}
autoService.catalog.buildPartsTypeAll = function(jsonobj, partType){
     var listenerPrevPart = function(e){
        var id = e.target.iditem;
        var dialogComponent = new goog.ui.Component();
        

        //var title = goog.dom.createDom('span',undefined, "Make an enquiry");
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Send enquiry");
        //buttonDom.idfield = id;
       // goog.events.listen(buttonDom, goog.events.EventType.CLICK,makeRequestListener);

        var sendEnquiryForm = new goog.ui.Control(
                goog.dom.createDom('form',{'id':'info-order','class':'info-enquiry'/*,'name':'betForm','method':'post', 'action':'controller'*/},
                    goog.dom.createDom('span',undefined, "Make an enquiry"),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'type':'text','name':'username','value':'','placeholder':'Enter your name'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'email','value':'','placeholder':'Enter your e-mail'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'phone','value':'','placeholder':'Enter your phone number'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('textarea',{'class':'info-order-input','name':'info','value':'','placeholder':'Describe your auto and required part'})
                    ),
                    goog.dom.createDom('p',undefined,
                        buttonDom
                    )
                )
            );
        var images = new goog.ui.Control(goog.dom.createDom('img',{'class':'car-parts-modal-img','src':jsonobj[0].img}));
        var info = new goog.ui.Control(goog.dom.createDom('div','info-block',
            goog.dom.createDom('p',undefined, "Car brand: ", jsonobj[id].brand),
            goog.dom.createDom('p',undefined, "Model: ",jsonobj[id].model),
            goog.dom.createDom('p',undefined, "Year: ",jsonobj[id].year),
            goog.dom.createDom('p',undefined, "Type: ",jsonobj[id].title),
            goog.dom.createDom('p',undefined, "Status: ",jsonobj[id].status),
            goog.dom.createDom('p',undefined, "Price: ",jsonobj[id].price)
            )
        );
        var btnPrev = goog.dom.createDom('button',{'class':'class'}, "<");
        var btnNext = goog.dom.createDom('button',{'class':'class'}, ">");
        var btns = goog.dom.createDom('p',undefined,btnPrev,btnNext);
        btnPrev.iditem = --id;
        btnNext.iditem = ++id;
        goog.events.listen(btnPrev, goog.events.EventType.CLICK,listenerPrevPart);
        goog.events.listen(btnNext, goog.events.EventType.CLICK,listenerNextPart);
        var navButtons = new goog.ui.Control(btns);
        

        sendEnquiryForm.setAllowTextSelection(true); //recursively ??
        var partInfo = new goog.ui.Control();
        partInfo.addChild(images,true);
        partInfo.addChild(info,true);
        partInfo.addChild(sendEnquiryForm,true);
        partInfo.addChild(navButtons,true);

        partInfo.setAllowTextSelection(true);
        dialogComponent.addChild(partInfo,true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
        //dialog1.setAutoHide(true);
        dialog1.setDraggable(false);

        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        dialog1.setVisible(true);  
    }
    var listenerNextPart = function(e){
        dialog1.exitDocument();
        var id = e.target.iditem;
        var dialogComponent = new goog.ui.Component();
        

        //var title = goog.dom.createDom('span',undefined, "Make an enquiry");
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Send enquiry");
        //buttonDom.idfield = id;
       // goog.events.listen(buttonDom, goog.events.EventType.CLICK,makeRequestListener);

        var sendEnquiryForm = new goog.ui.Control(
                goog.dom.createDom('form',{'id':'info-order','class':'info-enquiry'/*,'name':'betForm','method':'post', 'action':'controller'*/},
                    goog.dom.createDom('span',undefined, "Make an enquiry"),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'type':'text','name':'username','value':'','placeholder':'Enter your name'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'email','value':'','placeholder':'Enter your e-mail'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'phone','value':'','placeholder':'Enter your phone number'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('textarea',{'class':'info-order-input','name':'info','value':'','placeholder':'Describe your auto and required part'})
                    ),
                    goog.dom.createDom('p',undefined,
                        buttonDom
                    )
                )
            );
        var images = new goog.ui.Control(goog.dom.createDom('img',{'class':'car-parts-modal-img','src':jsonobj[0].img}));
        var info = new goog.ui.Control(goog.dom.createDom('div','info-block',
            goog.dom.createDom('p',undefined, "Car brand: ", jsonobj[id].brand),
            goog.dom.createDom('p',undefined, "Model: ",jsonobj[id].model),
            goog.dom.createDom('p',undefined, "Year: ",jsonobj[id].year),
            goog.dom.createDom('p',undefined, "Type: ",jsonobj[id].title),
            goog.dom.createDom('p',undefined, "Status: ",jsonobj[id].status),
            goog.dom.createDom('p',undefined, "Price: ",jsonobj[id].price)
            )
        );
        var btnPrev = goog.dom.createDom('button',{'class':'class'}, "<");
        var btnNext = goog.dom.createDom('button',{'class':'class'}, ">");
        var btns = goog.dom.createDom('p',undefined,btnPrev,btnNext);
        btnPrev.iditem = --id;
        btnNext.iditem = ++id;
        goog.events.listen(btnPrev, goog.events.EventType.CLICK,listenerPrevPart);
        goog.events.listen(btnNext, goog.events.EventType.CLICK,listenerNextPart);
        var navButtons = new goog.ui.Control(btns);
        

        sendEnquiryForm.setAllowTextSelection(true); //recursively ??
        var partInfo = new goog.ui.Control();
        partInfo.addChild(images,true);
        partInfo.addChild(info,true);
        partInfo.addChild(sendEnquiryForm,true);
        partInfo.addChild(navButtons,true);

        partInfo.setAllowTextSelection(true);
        dialogComponent.addChild(partInfo,true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
        //dialog1.setAutoHide(true);
        dialog1.setDraggable(false);

        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        dialog1.setVisible(true);  
    }
    var listenerCatalog = function(e) {
        var id = e.target.iditem;
        var dialogComponent = new goog.ui.Component();
        

        //var title = goog.dom.createDom('span',undefined, "Make an enquiry");
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Send enquiry");
        //buttonDom.idfield = id;
       // goog.events.listen(buttonDom, goog.events.EventType.CLICK,makeRequestListener);

        var sendEnquiryForm = new goog.ui.Control(
                goog.dom.createDom('form',{'id':'info-order','class':'info-enquiry'/*,'name':'betForm','method':'post', 'action':'controller'*/},
                    goog.dom.createDom('span',undefined, "Make an enquiry"),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'type':'text','name':'username','value':'','placeholder':'Enter your name'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'email','value':'','placeholder':'Enter your e-mail'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-order-input','type':'text','name':'phone','value':'','placeholder':'Enter your phone number'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('textarea',{'class':'info-order-input','name':'info','value':'','placeholder':'Describe your auto and required part'})
                    ),
                    goog.dom.createDom('p',undefined,
                        buttonDom
                    )
                )
            );
        var images = new goog.ui.Control(goog.dom.createDom('img',{'class':'car-parts-modal-img','src':jsonobj[0].img}));
        var info = new goog.ui.Control(goog.dom.createDom('div','info-block',
            goog.dom.createDom('p',undefined, "Car brand: ", jsonobj[id].brand),
            goog.dom.createDom('p',undefined, "Model: ",jsonobj[id].model),
            goog.dom.createDom('p',undefined, "Year: ",jsonobj[id].year),
            goog.dom.createDom('p',undefined, "Type: ",jsonobj[id].title),
            goog.dom.createDom('p',undefined, "Status: ",jsonobj[id].status),
            goog.dom.createDom('p',undefined, "Price: ",jsonobj[id].price)
            )
        );
        var btnPrev = goog.dom.createDom('button',{'class':'class'}, "<");
        var btnNext = goog.dom.createDom('button',{'class':'class'}, ">");
        var btns = goog.dom.createDom('p',undefined,btnPrev,btnNext);
        btnPrev.iditem = --id;
        btnNext.iditem = ++id;
        goog.events.listen(btnPrev, goog.events.EventType.CLICK,listenerPrevPart);
        goog.events.listen(btnNext, goog.events.EventType.CLICK,listenerNextPart);
        var navButtons = new goog.ui.Control(btns);
        

        sendEnquiryForm.setAllowTextSelection(true); //recursively ??
        var partInfo = new goog.ui.Control();
        partInfo.addChild(images,true);
        partInfo.addChild(info,true);
        partInfo.addChild(sendEnquiryForm,true);
        partInfo.addChild(navButtons,true);

        partInfo.setAllowTextSelection(true);
        dialogComponent.addChild(partInfo,true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
        //dialog1.setAutoHide(true);
        dialog1.setDraggable(false);

        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        dialog1.setVisible(true);  
    };
    autoService.catalog.buildHeaders(partType);

    var element = goog.dom.getElement('car-parts');

     var component = new goog.ui.Component();
    for(var i in jsonobj){
        var img = goog.dom.createDom('img',{'class': 'latest-winners-img', 'src': jsonobj[i].img});
        var block = goog.dom.createDom('div','car-part-item',
                img,
                goog.dom.createDom('span','latest-winners-details',jsonobj[i].title),
                goog.dom.createDom('span','latest-winners-details',jsonobj[i].brand),
                goog.dom.createDom('span','latest-winners-details',jsonobj[i].model),
                goog.dom.createDom('span','latest-winners-details',jsonobj[i].price)
            );
        block.iditem = i;
        goog.events.listen(block, goog.events.EventType.CLICK,listenerCatalog);
        var blockControl =  new goog.ui.Control(block);
        component.addChild(blockControl,true);
    }
    component.render(element);
};