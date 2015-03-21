goog.provide('autoService.bids');

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

autoService.bids.buildTableBids = function(url, brandName){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.bids.listOfBids(jsonobj);
    });
};
/** @param {function(Element)} list  */
autoService.bids.listOfBids = function(jsonobj){
   /* var jsonobj;
    if(brandName != undefined)
        jsonobj = jsonobj0[0][brandName];
    else jsonobj = jsonobj0;*/

    var tableContainer = new goog.ui.Container();
    var tableHeader = 
        goog.dom.createDom('table',"table table-bordered table-hover",
            goog.dom.createDom('thead',undefined,
                goog.dom.createDom('tr',undefined,
                    goog.dom.createDom('th',undefined, "Picture"),
                    goog.dom.createDom('th',undefined, "Car brand"),
                    goog.dom.createDom('th',undefined, "Model"),
                    goog.dom.createDom('th',undefined, "Lot"),
                    goog.dom.createDom('th',undefined, "Bet, $"),
                    goog.dom.createDom('th',undefined, "")
                    )
            )
        
    );



    var tbody = goog.dom.createDom('tbody',undefined);

    var makeBetListener = function(e) {
        var id = e.target.idfield;
        var usernameValue;
        var betValue;
        var betFormElement = goog.dom.getElement('info-bet');

        for(var i = 0; i < betFormElement.length; ++i){
            if(betFormElement.elements[i].name == 'username')
                usernameValue = betFormElement.elements[i].value;
            else if(betFormElement.elements[i].name == 'bet')
                betValue = betFormElement.elements[i].value;
        }

        var length = jsonobj[id].bid.length - 1;
        //alert(length);
        //alert(jsonobj[id].bid[0].username);
        jsonobj[id].bid[length].username = usernameValue;
        jsonobj[id].bid[length].rate = betValue;
        
        //alert(jsonobj[id].bid[length].username);
        var postData = JSON.stringify(jsonobj);
        goog.net.XhrIo.send('/api/auction-auto/all-models.json', callback, 'POST', postData);

        alert(usernameValue + ': ' + betValue);
    }
    var listener = function(e) {
        var id = e.target.idfield;
        //var domHelper = goog.dom.getDomHelper('popup');
        var dialogComponent = new goog.ui.Component();
        var model = new goog.ui.Control(
            goog.dom.createDom('span',undefined,jsonobj[id].model)
            );
        var img = new goog.ui.Control(
            goog.dom.createDom('div','info-div-pic',
                goog.dom.createDom('img',{'class': 'info-image', 'src': jsonobj[id].img})
               )
            );
        var carBrand = brandName?brandName:jsonobj[id].carBrand;
        var info = new goog.ui.Control(goog.dom.createDom('div','info-block',
            //goog.dom.createDom('p',undefined, "Car brand: ", carBrand),
            //goog.dom.createDom('p',undefined, "Model: ",jsonobj[id].model),
            goog.dom.createDom('p',undefined, "Year: ",jsonobj[id].year),
            goog.dom.createDom('p',undefined, "Type: ",jsonobj[id].engine_type),
            goog.dom.createDom('p',undefined, "Volume: ",jsonobj[id].volume),
            goog.dom.createDom('p',undefined, "Mileage: ",jsonobj[id].mileage),
            goog.dom.createDom('p',undefined, "Transmission: ",jsonobj[id].transmission)
            )
        );

        var lastBet = new goog.ui.Control(
            goog.dom.createDom('div','info-lastbet', "The last bet ",
                goog.dom.createDom('p',undefined, jsonobj[id].bid[0].username,": ",jsonobj[id].bid[0].rate + " $"),
                goog.dom.createDom('p',undefined, "Time left: ",": ",jsonobj[id].bid[0].time_left + " days")
                )
            );
/*
        var usernameInput = new goog.ui.Control(
            goog.dom.createDom('input',{'type':'text','name':'username','value':'','placeholder':'Username'})
        );
        
        var betInput = new goog.ui.Control(
            goog.dom.createDom('input',{'type':'text','name':'bet','value':'','placeholder':'Enter your bet'})
            );
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Make a bet");
        var makeBetBtn = new goog.ui.Control(
                buttonDom
            );
        var betInfo = new goog.ui.Control(
            //goog.dom.createDom('div','info-bet',lastBet,price,makeABet)
            goog.dom.createDom('form',{'class':'info-bet','name':'betForm','method':'post', 'action':'controller'})
            );
*/
/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
for(var tmp in jsonobj[0])
    alert(jsonobj[0][tmp]);
*/
        var spanInfo = goog.dom.createDom('span',undefined, "Enter your username and a new bet");
        var buttonDom = goog.dom.createDom('button',{'type':'submit','name':'commit','value':'some'}, "Make a bet");
        buttonDom.idfield = id;

        var makeBetForm = new goog.ui.Control(
                goog.dom.createDom('form',{'id':'info-bet','class':'info-bet'/*,'name':'betForm','method':'post', 'action':'controller'*/},
                    spanInfo,
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-bet-input','type':'text','name':'username','value':'','placeholder':'Username'})
                    ),
                    goog.dom.createDom('p',undefined,
                        goog.dom.createDom('input',{'class':'info-bet-input','type':'text','name':'bet','value':'','placeholder':'Enter your bet'})
                    ),
                    goog.dom.createDom('p',undefined,
                        buttonDom
                    )
                )
            );
        
        goog.events.listen(buttonDom, goog.events.EventType.CLICK,makeBetListener);
        makeBetForm.setAllowTextSelection(true); //recursively ??
        var betInfo = new goog.ui.Control();
        betInfo.setAllowTextSelection(true);
        betInfo.addChild(lastBet,true);
        //betInfo.addChild(betInput,true);
        //betInfo.addChild(usernameInput,true);
        //betInfo.addChild(makeBetBtn,true);
        betInfo.addChild(makeBetForm,true);

        var carInfo = new goog.ui.Control(goog.dom.createDom('div',undefined));
        carInfo.addChild(img,true);
        carInfo.addChild(info,true);
        //dialogComponent.addChild(img,true);
        //dialogComponent.addChild(info,true);
        //
        dialogComponent.addChild(carInfo,true);
        dialogComponent.addChild(betInfo,true);
       //dialogContainer.render( goog.dom.getElement('popup'));
      //  goog.style.setUnselectable(info, false);
        info.setAllowTextSelection(true);
        betInfo.setAllowTextSelection(true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
       // dialog1.setAutoHide(true);
        dialog1.setDraggable(false);
        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setTitle(jsonobj[id].carBrand + ' ' + jsonobj[id].model);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);
        //

/*
        var buttons = new goog.ui.Dialog.ButtonSet();
        buttons.set(goog.ui.Dialog.DefaultButtonKeys.CANCEL,
            'Cancel',
            false,
            true);
    
    buttons.set(goog.ui.Dialog.DefaultButtonKeys.OK,
       'Continue',
       true);
        dialog1.setButtonSet(buttons);
*/
        goog.events.listen(dialog1, goog.ui.Dialog.EventType.SELECT, function(e) {
        });

        dialog1.setVisible(true);  

    };
    
    for(var i in jsonobj){
        var betButton = goog.dom.createDom('button',{'type':'submit', 'class': 'button-more'}, "Learn more..");
        var img = goog.dom.createDom('img',{'class': 'table-image', 'src': jsonobj[i].img});
        var tr = goog.dom.createDom('tr',undefined,
            img,
            goog.dom.createDom('td','table-row',brandName?brandName:jsonobj[i].carBrand),
            goog.dom.createDom('td','table-row',jsonobj[i].model),
            goog.dom.createDom('td','table-row',jsonobj[i].lot),
            goog.dom.createDom('td','table-row',jsonobj[i].price),
            betButton
        );
        goog.dom.appendChild(tbody,tr);
        betButton.idfield = i;

        goog.events.listen(betButton, goog.events.EventType.CLICK, listener);
    }

   // var ttbody = new goog.ui.Control(tbody);
    //tableHeader.addChild(ttbody,true);
    goog.dom.appendChild(tableHeader,tbody)
    var table = new goog.ui.Control(tableHeader);
    tableContainer.addChild(table,true);
    tableContainer.render(goog.dom.getElement('car-auction'));
};
