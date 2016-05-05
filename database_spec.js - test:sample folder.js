// 'use strict';

// var fs = require('fs');
// var oracledb = require('oracledb');
// var dbConfig = require('../../support/dbconfig.json');
// // var env = require('../../support/env');
// var test = require('selenium-webdriver/testing');

// var dbEnv = "dev1"; // environment you wish to execute
// var dbConnectString = dbConfig[dbEnv].host + ":" + dbConfig[dbEnv].port + "/" + dbConfig[dbEnv].sid;
// test.describe.skip("Oracle DB Connection", function() {

// 	test.it.skip("Should connect and execute a command", function(done) {
// 		oracledb.getConnection(
// 		{
// 			user          : dbConfig[dbEnv].user,
// 			password      : dbConfig[dbEnv].password,
// 			connectString : dbConnectString
// 		},
// 		function(err, connection)
// 		{
// 	    if (err) {
// 	      console.error(err.message);
// 	      done();
// 	      return;
// 	    }
// 	    console.log('Connection was successful to ' + dbConnectString + ' !!');

// 	    connection.execute(
// 	      "SELECT * FROM WPP_DMC_RGN",
// 	      function(err, result)
// 	      {
// 	        console.log('executing command');
// 	        if (err) {
// 	          console.error('Error: ' + err.message);
// 	          done();
// 	          return;
// 	        }
// 	        console.log(result.rows);  // print all returned rows
// 	        connection.release(
// 	        function(err)
// 	        {
// 	          if (err) {
// 	            console.error(err.message);
// 	            done();
// 	            return;
// 	          }
// 	          console.log('Connection was closed successfully!');
// 	        });
// 	        done();
// 	        return;
// 	      });
// 	    });
// 	});
// });