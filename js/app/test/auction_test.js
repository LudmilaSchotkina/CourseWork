goog.require('autoService.auction');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');

var testEmpty = function() {
	//assertFalse('should reject null', autoService.auction.tableBody(jsonobj,''));
	assertFalse('should reject null', makeBetListener(null));
};

