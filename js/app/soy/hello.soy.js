// This file was automatically generated from hello.soy.
// Please don't edit this file by hand.

goog.provide('autoService.templates');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
autoService.templates.welcome = function(opt_data, opt_ignored) {
  return '<h1 id="greeting">' + soy.$$escapeHtml(opt_data.greeting) + '</h1>The year is ' + soy.$$escapeHtml(opt_data.year) + '.';
};
