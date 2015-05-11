goog.provide('autoService.bids');

goog.require('goog.dom');
goog.require('goog.net.XhrIo');
goog.require('goog.events');
goog.require('goog.object');
goog.require('goog.ui.decorate');
goog.require('goog.ui.Container');
goog.require('goog.ui.Control');
goog.require('goog.style');

goog.require('goog.fx');
goog.require('goog.fx.dom');
goog.require('goog.fx.AnimationQueue');
goog.require('goog.fx.AnimationSerialQueue');
goog.require('goog.fx.AnimationParallelQueue');

/** @param {function(Element)} buildHotBids  */
autoService.bids.buildHotBids = function(url){
    goog.net.XhrIo.send(url, function(e) {
        var xhr = /** @type {goog.net.XhrIo} */ (e.target);
        var jsonobj = xhr.getResponseJson();
        autoService.bids.listOfHotBids(jsonobj);
    });
};
/** @param {function(Element)} listOfHotBids  */
autoService.bids.featured = function(jsonobj,key,i){
    var link = '#/auction/lots/'+jsonobj[key][i].lot;

    var blockdom = goog.dom.createDom('div',{'class': 'featured-lot'},
            goog.dom.createDom('div','featured-lot-header','Featured'),
            goog.dom.createDom('div',undefined, 
                goog.dom.createDom('a',{'href':link},
                    goog.dom.createDom('img',{'class': 'latest-winners-img', 'src': jsonobj[key][i].img})
                    )
                ),
            goog.dom.createDom('div','latest-winners-details',
                goog.dom.createDom('a',{'href':link},
                    goog.dom.createDom('span',undefined,jsonobj[key][i].year+' '+key+' '+jsonobj[key][i].model)
                    )
                ),
            goog.dom.createDom('div','latest-winners-price','$'+jsonobj[key][i].parameters[0].rate)
        );
    return blockdom;
}
autoService.bids.listOfHotBids = function(jsonobj0){
    var jsonobj = jsonobj0[0];
    var domElement = goog.dom.getElement('hot-bids');
    var boxSize = goog.style.getSize(domElement);

    var component = new goog.ui.Component();
    var boxDomContainer = goog.dom.createDom('div', undefined);

    var id = 0;
    for (var key in jsonobj) {    
        for(var i in jsonobj[key]){
            var blockdom = autoService.bids.featured(jsonobj,key,i);
            //goog.style.setPosition(blockdom,leftpos,10);
            blockdom.id = id;
            ++id;
            var block =  new goog.ui.Control(blockdom);
            //goog.dom.appendChild(boxDomContainer,blockdom);
            component.addChild(block,true);            
        }
    }
    //var component = new goog.ui.Control(boxDomContainer);
    component.render(domElement);

    var el = goog.dom.getElementsByClass('featured-lot');
    var lotSize = goog.style.getSize(el[0]);
   
    var row = Math.floor(boxSize.width/(lotSize.width+20));
    var column = Math.ceil((id+1)/row);
    var height = column*(lotSize.height+20);
    var width = row*(lotSize.width+20);
    //alert(height);
    var tmp = (boxSize.width - width)/2;
    var tmp2 ='margin: 0px '+ tmp+'px;';
// boxDomContainer.style.cssText = tmp2;
 //   goog.style.setSize(boxDomContainer, width, height);
    goog.style.setSize(domElement, boxSize.width, height);

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
    var winnersBox = goog.dom.getElement('latest-winners');
    var component = new goog.ui.Component();
    var winScrollComponent = new goog.ui.Component();

    var boxSize = goog.style.getSize(winnersBox);
    var boxPosition = goog.style.getPosition(winnersBox);
    var domArray = [];
    var j=0;

    var boxDomContainer = goog.dom.createDom('div', {'class':'won-lot-container'});
    boxDomContainer.width = boxSize.width - 25;
    boxDomContainer.height = boxSize.height - 10;
    boxDomContainer.x = boxPosition.x+10;
    boxDomContainer.y = boxPosition.y+5;

    var id = 0;
    for (var key in jsonobj) {    
        for(var i in jsonobj[key]){
            var link = '#/auction/lots/'+jsonobj[key][i].lot;
            var blockdom = goog.dom.createDom('div',{'class': 'won-lot'},
                    goog.dom.createDom('div',undefined,
                        goog.dom.createDom('a',{'href': link},
                            goog.dom.createDom('img',{'class': 'latest-winners-img', 'src': jsonobj[key][i].img})
                            )
                        ),
                    goog.dom.createDom('div','latest-winners-details',
                        goog.dom.createDom('a',{'href': link},
                            goog.dom.createDom('span',undefined,jsonobj[key][i].year+' '+key+' '+jsonobj[key][i].model)
                            )
                        ),
                    goog.dom.createDom('div','latest-winners-price','$'+jsonobj[key][i].parameters[0].rate)
                );
            domArray[j] = blockdom;
            //blockdom.style.cssText = 'position: absolute;';
            goog.style.setSize(blockdom, 100,90);
            var leftpos = 150*j+20;
            
            ++j;
            //goog.style.setPageOffset(blockdom,100);
            goog.style.setPosition(blockdom,leftpos,10);
            blockdom.x = leftpos;
            blockdom.y = 10;
            blockdom.width = 100;
            blockdom.height = 90;
            blockdom.id = id;
            ++id;
            var block =  new goog.ui.Control(blockdom);
            goog.dom.appendChild(boxDomContainer,blockdom);
        }
    }

    var boxElNumber = 0;
    goog.array.forEach(domArray,function(el){
        if(el.x + el.width > boxSize.width){
            el.style.cssText = 'visibility: hidden;';
            el.isVisible = 0;
        }
        else el.isVisible = 1;
        if(el.isVisible!=0)
            ++boxElNumber;
    });
    

   // boxDomContainer.width = domArray[boxElNumber].x + domArray[boxElNumber].width;
    boxDomContainer.width = boxSize.width;
    goog.style.setSize(boxDomContainer, boxDomContainer.width, boxDomContainer.height);
    goog.style.setPosition(boxDomContainer,boxDomContainer.x, boxDomContainer.y);

    domArray[0].boxElNumber = boxElNumber;

    var navBtnLeft = goog.dom.createDom('p',{'class':'nav-scroll'},"<");
    goog.style.setPosition(navBtnLeft,boxPosition.x);
    var navBtnRight = goog.dom.createDom('p','nav-scroll',">");
    goog.style.setPosition(navBtnRight, boxPosition.x+boxSize.width-20);

    component.addChild(new goog.ui.Control(boxDomContainer),true);            
    var navLeft = new goog.ui.Control(navBtnLeft);
    var navRight = new goog.ui.Control(navBtnRight);
    navBtnLeft.navType = "left";
    navBtnRight.navType = "right";
    goog.events.listen(navBtnLeft, goog.events.EventType.CLICK, scrollListener);
    goog.events.listen(navBtnRight, goog.events.EventType.CLICK, scrollListener);

    winScrollComponent.addChild(navLeft,true);
    winScrollComponent.addChild(component,true);
    winScrollComponent.addChild(navRight,true);

    winScrollComponent.render(winnersBox);
}


function scrollListener(e) {

    var winnersBox = goog.dom.getElementByClass('won-lot-container');
    var boxSize = goog.style.getSize(winnersBox);
    var wonlot = goog.dom.getElementsByClass('won-lot');
    var boxElNumber = wonlot[0].boxElNumber;
    var startCoordX = wonlot[0].x;
    
    var currEl = 0;
    while(wonlot[currEl].isVisible!=1){
        ++currEl;
    }


    var totalCurNumber = currEl;
    var queue  = new goog.fx.AnimationSerialQueue();

    if(e.target.navType == "right"){
        if(wonlot.length - (currEl+boxElNumber)<boxElNumber && wonlot.length - (currEl+boxElNumber) > 0)
            totalCurNumber = wonlot.length - (currEl+boxElNumber);
        else totalCurNumber = boxElNumber-1;

        if(wonlot[wonlot.length-1].isVisible!=1){
            autoService.bids.changeProperty(wonlot,currEl,totalCurNumber+currEl,0);
          
            var tmp = 0;
            var queue  = new goog.fx.AnimationSerialQueue();
            for(var i = currEl+totalCurNumber; i < currEl+totalCurNumber+boxElNumber; ++i){
                var newx = startCoordX + 20 + tmp*(wonlot[i].width+60);
                wonlot[i].style.cssText = 'visibility: visible;';
                wonlot[i].isVisible = 1;
                queue.add(new goog.fx.dom.Slide(wonlot[i],[550, wonlot[i].y], [newx, wonlot[i].y], 60, goog.fx.easing.easeOut));
                goog.style.setPosition(wonlot[i],550,wonlot[i].y);
                ++tmp;
            }
            queue.play();
        }
    }
    else if(e.target.navType == "left"){
        if(currEl < boxElNumber && currEl > 0)
            totalCurNumber = boxElNumber- 1;

        if(wonlot[0].isVisible!=1){
            var tmp=0;
            for(var i = totalCurNumber; i > totalCurNumber - boxElNumber; --i){
                var newx = boxSize.width - 2*wonlot[i].width - tmp*(wonlot[i].width+60);
                wonlot[i].isVisible = 1;
                wonlot[i].style.cssText = 'visibility: visible;';
                queue.add(new goog.fx.dom.Slide(wonlot[i],[220, wonlot[i].y], [newx, wonlot[i].y], 60, goog.fx.easing.easeOut));
                goog.style.setPosition(wonlot[i],220,wonlot[i].y);
                tmp++;
            }
            queue.play();
            autoService.bids.changeProperty(wonlot,totalCurNumber+1,/*totalCurNumber+currEl+1*/totalCurNumber+boxElNumber,0);   
        }
    }  
    

}

autoService.bids.changeProperty = function(array,start,end,isVisible){
    var cssProp = isVisible?'visibility: visible;':'visibility: hidden;'
    for(var i = start; i < end; ++i){
        array[i].isVisible = isVisible;
        array[i].style.cssText = cssProp;
    }
}