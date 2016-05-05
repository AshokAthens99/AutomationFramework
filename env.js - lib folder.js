var where = process.env['ENVIRONMENT'] || 'dev1';
var browser = process.env['BROWSER'] || 'firefox';
var platform = process.env['PLATFORM'] || 'desktop';
var width = process.env['BROWSER_WIDTH'];
var height = process.env['BROWSER_HEIGHT'];

var capabilities = require('../data/capabilities.json');

var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');

var test = require('selenium-webdriver/testing');

var propertiesReader = require('properties-reader');

var basedir = './target/endtoend/screenshots/';
var seleniumtimeout = process.env['seleniumtimeout'];

var driverconfig = propertiesReader('./driverconfig.properties');

var users = require('./users');

var driver;

var chai = require('chai');  
var chaiAsPromised = require('chai-as-promised'); 
chai.use(chaiAsPromised);  
chai.config.truncateThreshold = 0;  

global.webdriver = webdriver;  
global.chaiAsPromised = chaiAsPromised;  
global.expect = chai.expect;
global.test = test;




if (isNaN(seleniumtimeout)) {
  seleniumtimeout = 5000;
}
seleniumtimeout = parseInt(seleniumtimeout);

module.exports = {
  where: where,
  seleniumtimeout: seleniumtimeout,
  users: users,
  driver: function() {
    return driver;
  }
};

test.before(function() {
  if (platform === 'mobile') {
    console.log ("Browser  ", browser);
    openMobileBrowser();
  } else {
    console.log ("Browser  ", browser);
    console.log ("Capabilities  ", capabilities[browser]);
    openDesktopBrowser();
  }
});

test.beforeEach(function(){
  var currentTestName = this.currentTest.title;
  console.log('\n',currentTestName , ': Execution Starts ...' ,'\n');
  driver.manage().deleteAllCookies();
});

test.afterEach(function() {  
  var currentTestName = this.currentTest.title;
  driver.manage().deleteAllCookies();  

  
  if (this.currentTest.state === 'failed'){
    console.log('\n','Execution Status  -  ', this.currentTest.state.red);
  }
  if (this.currentTest.state === 'passed'){
    console.log('\n','Execution Status  -  ', this.currentTest.state.green);
  }
});

test.after(function() {
  driver.session_.then(function(sessionData) {
    if (sessionData.id) {
      driver.quit();
    } else {
      driver.close();
    }
  });
});

function openDesktopBrowser() {
  if (capabilities[browser] && capabilities[browser]['host']) {
    console.log("opening remote webdriver on " + capabilities[browser]['host']);
    driver = new webdriver.Builder()
      .usingServer(capabilities[browser]['host'])
      .withCapabilities(capabilities[browser]['browserCapabilities'])
      .build();
  } else {
    driver = new webdriver.Builder()
      .withCapabilities(capabilities[browser])
      .build();
  }
  driver.manage().deleteAllCookies();
  if (isNaN(width) || isNaN(height)) {
    driver.manage().window().maximize();
  } else {
    driver.manage().window().setSize(parseInt(width), parseInt(height));
  }
  driver.manage().timeouts().implicitlyWait(seleniumtimeout);
}

function openMobileBrowser() {

  var perfectoCapabilities = {
    browserName: 'mobileOS',
    deviceName: process.env['DEVICE_ID'], 
    user: process.env['PERFECTO_USERNAME'],
    password: process.env['PERFECTO_PASSWORD'],
    platformName: process.env['MOBILE_OS']
  };
  driver = new webdriver.Builder()
    .usingServer(capabilities['perfecto']['host'])
    .withCapabilities(perfectoCapabilities)
    .build();
  driver.manage().deleteAllCookies();
  driver.manage().timeouts().implicitlyWait(seleniumtimeout);
}