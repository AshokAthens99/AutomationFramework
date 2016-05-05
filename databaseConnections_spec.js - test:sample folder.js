var test = require('selenium-webdriver/testing');
var dbUtil = require('../../lib/dbUtils');
		
test.describe("Java Oracle db access", function() {

	test.it("select one row", function(done) {
		
		var results = dbUtil.executeQuerySync("SELECT * FROM WPP_DMC_RGN where DMC_RGN_PK=1");
		console.log(results);
		
		done();
	});

	test.it("select multiple rows", function(done) {
		
		var results = dbUtil.executeQuerySync("SELECT * FROM WPP_DMC_RGN");
		console.log(results);
		
		done();
	});	

	test.it("insert row", function(done) {
		
		var results = dbUtil.executeStatementSync("insert into WPP_DMC_RGN (DMC_RGN_PK, DMC_RGN_NAME, DMC_RGN_DESC) values (8, 'TES', 'TEST REGION')");
		console.log(results);
		
		done();
	});

	test.it("update row(s)", function(done) {
		
		var results = dbUtil.executeStatementSync("update WPP_DMC_RGN set DMC_RGN_DESC = 'TEST REGION UPDATED' where DMC_RGN_PK = 8");
		console.log(results);
		
		done();
	});

	test.it("delete row(s)", function(done) {
		
		var results = dbUtil.executeStatementSync("delete from WPP_DMC_RGN where DMC_RGN_PK = 8");
		console.log(results);
		
		done();
	});


});


	
	





