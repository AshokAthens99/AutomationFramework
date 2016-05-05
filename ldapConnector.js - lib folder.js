
'use strict';

var ldap = require('ldapjs');
var assert = require('chai').assert;

module.exports=function(){

    var devSearchBase= 'ou=members, o=kaiser permanente, c=us';

    var opts = {
        filter: '(uid=sca35039214)',
        scope: 'sub',
        attributes: ['dn', 'sn', 'cn']
    };

    var client = ldap.createClient({
        url: 'ldap://xlzxsap0016x.lvdc.kp.org:10389',
        bindDN: 'ou=1,ou=members, o=kaiser permanente,c=us'
    });





    return {
        performAddOperation: function () {

        },
        performDeleteOperation: function () {

        },
        performCompareOperation: function () {

        },
        performSearchOperation: function(){
            client.search(devSearchBase, opts, function(err, res) {

                console.log (opts);

                console.log ('value of !!!!');


                res.on('searchEntry', function(entry) {
                    console.log('success results!!!!');
                    console.log('entry: ' + JSON.stringify(entry.object));
                });
                res.on('searchReference', function(referral) {
                    console.log('reference results!!!!');
                    console.log('referral: ' + referral.uris.join());
                });
                res.on('error', function(err) {
                    console.log('error results!!!!');
                    console.error('error: ' + err.message);
                });
                res.on('end', function(result) {
                    console.log('status results!!!!');
                    console.log('status: ' + result.status);
                });
            });

            client.unbind(function (err) {
                if (err) {
                    console.log(err.code + ' : ' + err.name);
                } else {
                    console.log('closed');
                }
            });
        },
        performModifyOperation: function(){

        }
    }
};