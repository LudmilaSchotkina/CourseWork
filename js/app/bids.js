goog.provide('autoService.bids');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.decorate');
goog.require('goog.ui.Container');
goog.require('goog.ui.Control');
goog.require('goog.style');


/** @param {function(Element)} buildHotBids  */
autoService.bids.buildHotBids = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.bids.listOfHotBids(jsonobj);
    });
};
/** @param {function(Element)} listOfHotBids  */
autoService.bids.listOfHotBids = function(jsonobj0){
    var jsonobj = jsonobj0[0];
    var element = goog.dom.getElement('hot-bids');

     var component = new goog.ui.Component();
        for (var key in jsonobj) {
            for(var i in jsonobj[key]){
                var img = goog.dom.createDom('img',{'class': 'latest-winners-img', 'src': jsonobj[key][i].img});
                var block =  new goog.ui.Control(
                    goog.dom.createDom('div','hot-bids-block',
                        img,
                        goog.dom.createDom('span','latest-winners-details',key),
                        goog.dom.createDom('span','latest-winners-details',jsonobj[key][i].lot),
                        goog.dom.createDom('span','latest-winners-details',jsonobj[key][i].bid[0].rate),
                        goog.dom.createDom('span','latest-winners-details',jsonobj[key][i].bid[0].time_left)
                    )
                    );
                component.addChild(block,true);
            }
        }
        component.render(element);

}



/** @param {function(Element)} buildBidsWinners  */
autoService.bids.buildBidsWinners = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.bids.bidsWinners(jsonobj);
    });
};
/** @param {function(Element)} bidsWinners  */
autoService.bids.bidsWinners = function(jsonobj0){
    var jsonobj = jsonobj0[0];
    var element = goog.dom.getElement('latest-winners');

     var component = new goog.ui.Component();
        for (var key in jsonobj) {
            for(var i in jsonobj[key]){
                var img = goog.dom.createDom('img',{'class': 'latest-winners-img', 'src': jsonobj[key][i].img});
                var block =  new goog.ui.Control(
                    goog.dom.createDom('div','won-lot',
                        img,
                        goog.dom.createDom('span','latest-winners-details',key),
                        goog.dom.createDom('span','latest-winners-details',jsonobj[key][i].model),
                        goog.dom.createDom('span','latest-winners-details',jsonobj[key][i].parameters[0].rate)
                    )
                    );
                component.addChild(block,true);
            }
        }
        component.render(element);

}

