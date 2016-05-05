
'use strict';

var env = require('../../lib/env');
var until = require('selenium-webdriver').until;
var webdriver = require('selenium-webdriver');
var expect = require('chai').expect;
var by = webdriver.By;
var helper = require('../../lib/helper');
//var locator = require('../../locators.json').locator;
var allureReporter = require('../../lib/allureReporter');


module.exports = function(driver, config, where) {
    var signonUrl = config[where].host;
    var baseUrl = config[where].base;
    var apptUrl = config[where].ApptCenter;

    var signOn = {
        username: by.css('[name=username]'),
        password: by.css('[name=password]'),
        signonForm: by.css('#signonButtonDisplay'),
        signoff: by.linkText('Sign off'),
        signonButton: by.id('view7Submit'),
        sent: by.linkText('Sent'),
        signOnTitle : 'Kaiser Permanente'
    };

    var findDoctors ={
        doctorButton: by.css('[id=radioForDoctors]'),
        facilityButton: by.css('[id=radioForFacilities]'),
        findDoctor: by.linkText('Find doctors & locations')
    };

    var menu = {
        myHealth: by.linkText('My health manager'),
        wrongElement: by.linkText('My health manage'),
        healthValue: 'My health manager',
        healthTitle: 'my health manager: get wellness and coverage information - kaiser permanente',
        healthHalfValue: 'My health',
        healthWell: by.linkText('Health & wellness'),
        menubutton:by.id('menu-button'),
        appointments:by.linkText('Appointments'),
    };

    var homePage = {
        considerKp: by.id('t1-tab'),
        attrval: 'role',
        expectedValueOfattribute: 'tab',
    };

    var appointment = {
        healthClasses: by.css('#health-classes-sidebar'),
        firstMember: by.id('member-0'),
        memberValue:'Wppmrngcihagdejcgfn Wppmrnjaaefbggabfln',
        healthweight: by.id('Healthy Weight'),
        outletSection : by.id('outlet-section'),
        upcomingAppts : by.linkText('Upcoming Appointments'),
        scheduleHealth : by.linkText('Schedule a Health class'),
        schedulePage : by.id('schedule-page-button')
    };

    return {
        verifyRWDApptPage: function () {
            helper.waitTillItemIsReady([
                appointment.upcomingAppts,
                appointment.schedulePage

            ]);
        },

        verifyHomePage: function () {
            helper.waitTillItemIsReady([
                menu.myHealth
            ]);
        },

        proxyPicker: function () {
            driver.get(apptUrl);
            this.verifyRWDApptPage();
            driver.findElement(appointment.healthClasses).click();
            driver.manage().timeouts().implicitlyWait(env.seleniumtimeout);
            helper.selectOptionFromDropDown(appointment.firstMember, appointment.memberValue);

        },

        clickfacility: function () {
            driver.findElement(findDoctors.findDoctor).click();
            helper.clickRadioButton(findDoctors.doctorButton);
        },

        textValue: function () {
            var actVal;
            this.verifyHomePage();
            helper.assertIsNotPresent(menu.wrongElement);
            helper.verifyTitle(menu.healthTitle);
            helper.getTextValue(menu.myHealth).then(function (actualValue) {
             expect(actualValue.toLowerCase().trim()).to.equal(menu.healthValue.toLowerCase().trim());
             });
        },
        pageLoad: function () {
            helper.waitUntilLoadingCompleted();
            var date=helper.returnTodaysDateAsString();
            console.log("Date "+date);
        }

    }
};

