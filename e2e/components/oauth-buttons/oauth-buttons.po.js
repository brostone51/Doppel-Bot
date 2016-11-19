/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var OauthButtons = function() {
  var oauthButtons = this.oauthButtons = element(by.css('oauth-buttons'));
  oauthButtons.twitter = oauthButtons.element(by.css('.btn.btn-twitter'));
};

module.exports = new OauthButtons();
