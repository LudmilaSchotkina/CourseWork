goog.provide('autoService.auction');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.decorate');
goog.require('goog.ui.Container');
goog.require('goog.ui.Control');
goog.require('goog.style');
goog.require('goog.ui.Dialog');
goog.require('goog.json');

/**
 * In auction.js described all functions for the auction autos
*/

/**
 * Renders table of lots
 * @param  {Object} jsonobj0  parsed json
 * @param  {string=} brandName optionan name of car brand
 */
autoService.auction.listOfLots = function(jsonobj0,brandName){
    var jsonobj=jsonobj0[0];
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
        /** @type {string} */
        var id = e.target.idfield;
        var key = e.target.key;
        var usernameValue;
        var betValue;
        var betFormElement = goog.dom.getElement('info-bet');

        for(var i = 0; i < betFormElement.length; ++i){
            if(betFormElement.elements[i].name == 'username')
                usernameValue = betFormElement.elements[i].value;
            else if(betFormElement.elements[i].name == 'bet')
                betValue = betFormElement.elements[i].value;
        }

        var length = jsonobj[key][id].bid.length - 1;
        jsonobj[key][id].bid[length].username = usernameValue;
        jsonobj[key][id].bid[length].rate = betValue;
        var postData = JSON.stringify(jsonobj);
        goog.net.XhrIo.send('/api/auction-auto/all-models.json', callback, 'POST', postData);
        alert(usernameValue + ': ' + betValue);
    }
    /** @param {function(Event)}  showInfoListener */
    var showInfoListener = function(e) {
        var id = e.target.idfield;
        var key = e.target.key;
        //var domHelper = goog.dom.getDomHelper('popup');
        var dialogComponent = new goog.ui.Component();
        var model = new goog.ui.Control(
            goog.dom.createDom('span',undefined,jsonobj[key][id].model)
            );
        var img = new goog.ui.Control(
            goog.dom.createDom('div','info-div-pic',
                goog.dom.createDom('img',{'class': 'info-image', 'src': jsonobj[key][id].img})
               )
            );
        var carBrand = key;
        var info = new goog.ui.Control(goog.dom.createDom('div','info-block',
            //goog.dom.createDom('p',undefined, "Car brand: ", carBrand),
            //goog.dom.createDom('p',undefined, "Model: ",jsonobj[id].model),
            goog.dom.createDom('p',undefined, "Year: ",jsonobj[key][id].year),
            goog.dom.createDom('p',undefined, "Type: ",jsonobj[key][id].engine_type),
            goog.dom.createDom('p',undefined, "Volume: ",jsonobj[key][id].volume),
            goog.dom.createDom('p',undefined, "Mileage: ",jsonobj[key][id].mileage),
            goog.dom.createDom('p',undefined, "Transmission: ",jsonobj[key][id].transmission)
            )
        );

        var lastBet = new goog.ui.Control(
            goog.dom.createDom('div','info-lastbet', "The last bet ",
                goog.dom.createDom('p',undefined, jsonobj[key][id].bid[0].username,": ",jsonobj[key][id].bid[0].rate + " $"),
                goog.dom.createDom('p',undefined, "Time left: ",": ",jsonobj[key][id].bid[0].time_left + " days")
                )
            );

        var spanInfo = goog.dom.createDom('span',undefined, "Enter your username and a new bet");
        var buttonDom = goog.dom.createDom('button',{'class':'button-more','type':'submit','name':'commit','value':'some'}, "Make a bet");
        buttonDom.idfield = id;
        buttonDom.key = key;

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
        makeBetForm.setAllowTextSelection(true); 
        var betInfo = new goog.ui.Control();
        betInfo.setAllowTextSelection(true);
        betInfo.addChild(lastBet,true);
        betInfo.addChild(makeBetForm,true);

        var carInfo = new goog.ui.Control(goog.dom.createDom('div',undefined));
        carInfo.addChild(img,true);
        carInfo.addChild(info,true);

        dialogComponent.addChild(carInfo,true);
        dialogComponent.addChild(betInfo,true);
        info.setAllowTextSelection(true);
        betInfo.setAllowTextSelection(true);

        var dialog1 = new goog.ui.Dialog();
        dialog1.setEscapeToCancel(true);
        dialog1.setHasTitleCloseButton(true);
       // dialog1.setAutoHide(true);
        dialog1.setDraggable(false);
        dialog1.addChild(dialogComponent,true);
        dialog1.setDisposeOnHide(true);
        dialog1.setTitle(carBrand + ' ' + jsonobj[key][id].model);
        dialog1.setButtonSet(goog.ui.Dialog.ButtonSet.CANCEL);

        goog.events.listen(dialog1, goog.ui.Dialog.EventType.SELECT, function(e) {
        });

        dialog1.setVisible(true);  

    };

    for (var key in jsonobj) {
        for(var i in jsonobj[key]){
            var betButton = goog.dom.createDom('button',{'type':'submit', 'class':'css-button'}, "Learn more..");
            var img = goog.dom.createDom('img',{'class': 'table-image', 'src': jsonobj[key][i].img});
            var tr = goog.dom.createDom('tr',undefined,
                img,
                goog.dom.createDom('td','table-row',key),
                goog.dom.createDom('td','table-row',jsonobj[key][i].model),
                goog.dom.createDom('td','table-row',jsonobj[key][i].lot),
                goog.dom.createDom('td','table-row',jsonobj[key][i].price),
                betButton
            );
            goog.dom.appendChild(tbody,tr);
            betButton.idfield = i;
            betButton.key = key;

            goog.events.listen(betButton, goog.events.EventType.CLICK, showInfoListener);
        }
    }
    goog.dom.appendChild(tableHeader,tbody)
    var table = new goog.ui.Control(tableHeader);
    tableContainer.addChild(table,true);
    tableContainer.render(goog.dom.getElement('car-auction'));
};


/** @param {function(Element)} buildTableLots  */
autoService.auction.buildTableLots = function(url, brandName){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        //var jsonobj2 = goog.json.parse(jsonobj);
        //var zu = JSON.parse(jsonobj);
        autoService.auction.listOfLots(jsonobj,brandName);
        
    });
};





/*
var component = new goog.ui.TableSorter();
    component.decorate(goog.dom.getElement('sortMe'));
    component.setSortFunction(1, goog.ui.TableSorter.alphaSort);
    component.setSortFunction(2,
        goog.ui.TableSorter.createReverseSort(goog.ui.TableSorter.numericSort));
*/