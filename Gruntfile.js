"use strict"

var webdriverTestSuite = require("./webdriver");
module.exports = function(grunt) {
  var directories = {
    target: 'target'
  };
  webdriverTestSuite('endtoend', grunt, directories);
};