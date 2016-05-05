var data = require('../../data/sample/jsonSample.json'); // Read the json data directly
var dataStream = require('../../lib/dataReader.js'); // Call the script file that reads the JSON
var _ = require("underscore-node");
var test = require('selenium-webdriver/testing');

var data1 = require('../../data/sample/jsonSample.json').provider;
var tags1 = ['realData','default'];
var tags2 = ['default'];
var data2 = require('../../data/sample/jsonSample.json').table2;
var groups = ['skittles'];

test.describe('Data_Reader | Sample usage of the new data reader file', function(){
	test.it('Test findByTag functionality', function(done){
		// Tags will only search if ANY tags will match
		var usersByTag1 = dataStream.findByTag(data1,tags1);
		console.log("\n\n<<<<<<<<<<<<<< Data by first tag >>>>>>>>>>>>>>>>>");
		_.each(usersByTag1, function (data) {
			// interface with ALL the data
			console.log(data);
			// interface with pieces of data not possible within loop
		});
		
		// Interfacing with data returned from 'findByTag'
		console.log("Region: " +usersByTag1.region);
		console.log("Provider first3: " +usersByTag1.provider_id_first3digits);
		console.log("Provider first5: " +usersByTag1.provider_id2_first5digits);
		console.log("Provider full ID: " +usersByTag1.provder_id3_fullid);
		console.log("Tags:" +usersByTag1.tags);
		done();
	});

	test.it('Test findBytTag functionality 2', function(done){
		console.log("\n\n<<<<<<<<<<<<<< Data by second Tag >>>>>>>>>>>>>>>>>");
		var usersByTag2 = dataStream.findByTag(data1,tags2);
		_.each(usersByTag2, function (data) {
			// Interact with all data info
			console.log(data);
			// interface with pieces of data not possible within loop
		});
		// Interfacing with data returned from 'findByTag'
		console.log("Region: " +usersByTag2.region);
		console.log("Provider first3: " +usersByTag2.provider_id_first3digits);
		console.log("Provider first5: " +usersByTag2.provider_id2_first5digits);
		console.log("Provider full ID: " +usersByTag2.provder_id3_fullid);
		console.log("Tags:" +usersByTag2.tags);
		done();
	});

	test.it('Test the findByGroup functionality', function(done){
		console.log("\n\n<<<<<<<<<<<<<< Data by one group >>>>>>>>>>>>>>>>>");
		var usersByGroup = dataStream.findByGroup(data2,groups);
		_.each(usersByGroup, function (data) {
			// interface with ALL the data
			console.log(data);
			// interface with pieces of data
			console.log("ID:" +data.id);
			console.log("Name:" +data.name);
			console.log("Passowrd:" +data.password);
			console.log("Tags:" +data.tags);
			console.log("group:" +data.group);
		});

		done();
	});

	test.it('Testing the listByTag functionality', function(done){
		// To pull the list of data based on a specific tag, we can use the listByTag mehtod.
		var listByTag = dataStream.listByTag(data1, 'default');
		console.log("list:");
		console.log(listByTag);
		done();
	});
});
