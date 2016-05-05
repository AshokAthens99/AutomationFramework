
'use strict';

var env = require('./env');
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var expect = require('chai').expect;
var allureReporter = require('./allureReporter');
var locator = require('../locators.json').landing;
var timeOut = 20000;
var baseEnv = require('../data/capabilities').baseUrl;
var where = process.env['ENVIRONMENT'] || 'dev1';

module.exports = {

  redirectUrl: function(url){
    var reUrl = url.substring(0,url.search("//")) + "//" + where + url.substring(url.search(".kaiser"));
    var redirectPromise = env.driver().get(reUrl);
    redirectPromise.then(function(){
      console.log("Launched ", reUrl ," Successfully ");
      allureReporter.takeScreenshot('Redirect URL completed successfully');
    }, function (error) {
      console.log('uh error', error);
    });
  },
  /**
   * Verify if the title of the page is as given in expected value
   * @param expectedTitle : The title to be verified
   */

  verifyTitle: function (expectedTitle) {
    env.driver().getTitle().then(function (actualTitle) {
      expect(expectedTitle.toLowerCase().trim()).to.equal(actualTitle.toLowerCase().trim());
    });
  },

  /**
   * Clicks on the radio button and returns the status of selection
   * @param locator : Webelement to be clicked
   */
  clickRadioButton: function (locator) {

    env.driver().isElementPresent(locator);
    env.driver().findElement(locator).click();
    return env.driver().findElement(locator).isSelected().then(function (selected) {
   //   return selected;
      expect(selected).to.be.true;
    }, function (error) {
      console.log('uh error', error);
    });
  },
  /**
   * Get the text value from the element
   * @param locator : Webelement where to fetch Text
   */
  getTextValue: function (locator) {
    env.driver().isElementPresent(locator);
    return env.driver().findElement(locator).getText().then(function (actualvalue) {
      return actualvalue;
    });
  },
  /**
   * Select value from drop down
   * @param selector :  Webelement of the drop down
   * @param selector :  item to be fetched from drop down
   */
  selectOptionFromDropDown: function (selector, item) {
    var valueToPick;
    var dropDownValues = env.driver().findElement(selector);
    dropDownValues.findElements(By.tagName('option'))
        .then(function findMatchingOption(options) {
          options.some(function (option) {
            option.getAttribute('label')
                .then(function doesOptionMatch(text) {
                  if (item.toUpperCase() === text.toUpperCase()) {
                    valueToPick = option;
                    return true;
                  }
                });
          });
        })
        .then(function clickOption() {
          if (valueToPick) {
            var actionSequence = new webdriver.ActionSequence(env.driver());
            return actionSequence.mouseMove(valueToPick).click(valueToPick).perform();
          }
        });
  },


  getTextListFor: function (locator) {
    return env.driver().findElements(locator).then(function (elements) {
      var textPromises = elements.map(function (e) {
        return e.getText();
      });
      return webdriver.promise.all(textPromises).then(function (text) {
        return text;
      });
    });
  },

  awaitCollection: function (finder) {
    return env.driver().wait(function () {
      return finder().then(function (result) {
        return result.length > 0;
      });
    }).then(function () {
      return finder();
    });
  },
  take: function () {
    screenshot.take();
  },

  /**
   * Waits till the loading icon goes away.  loading icon goes away after the page load is fully loaded
   */

  waitUntilLoadingCompleted: function () {
    env.driver().wait(function () {
      return env.driver().findElement(By.css(locator.loadingIcon)).isDisplayed().then(function (displayed) {
        return displayed === false;
      });
    }, env.timeOut);

  },

  /**
   This function will return today's date
   */
  returnTodaysDateAsString:function() {
    var today = new Date();
    var todayFormatted = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
    return todayFormatted;
  },
  /**
   * wait Till all Items mentioned in selectors are Ready
   * @param selectors :  List of elements to be checked in the page
   *
   */
  waitTillItemIsReady: function(selectors) {
    try {
      var waiters = selectors.map(function (selector) {
        return env.driver().wait(until.elementLocated(selector), env.timeOut);
      });
      webDriver.promise.all(waiters).then(function (elements) {
        elements.forEach(function (element) {
          expect(element).to.exist;
        });
      });
    } catch (error) {
      console.log("The error is"+error + '');
    }
  },
  /**
   * Verifies that element is not present
   * @param elementLocator :  Webelement to be searched
   *
   */
  assertIsNotPresent: function(elementLocator) {
    var driver = env.driver();

    driver.manage().timeouts().implicitlyWait(0);
    driver.isElementPresent(elementLocator).then(function(isDisplayed) {
      expect(isDisplayed).to.be.false;
    });
  },
  /**
   * Selects a radio button from the list of radio button
   * @param selector :  Webelement where the list of buttons exist
   * myOption: The radio button to be clicked from the list
   *
   */
  selectRadioOption:function(selector, myOption) {
    var optionsList = driver.findElements(selector);
    optionsList.then(function(options) {
      options.forEach(function(option) {
        option.getText().then(function(actualOption) {
          if (actualOption.indexOf(myOption) > -1) {
            return option.click();
          }
        });
      });
    });
  }

}