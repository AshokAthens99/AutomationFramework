

var _ = require("underscore-node");
var users = require('../data/users.json').users;

module.exports = {
  filterUsers:function(allUsers, byTags, byGroups){
    //console.log(Object.keys(byGroups[0]));
    var filteredUsers=[];
    var filteredByGroup= [];
    var filteredByTag=[];
    var filteredcount =0;
    var iterator =0;
    allUsers.filter(function(user){
      if (byGroups != undefined){
        for (var userLoopIt = 0;userLoopIt<Object.keys(user).length;userLoopIt++){
          var groupsThatMatch = 0;
          _.each(byGroups, function(group){
            //console.log(group[Object.keys(group)] + ' test result' + user[Object.keys(group)]);
            if(user[Object.keys(group)] && group[Object.keys(group)] == user[Object.keys(group)]) {
              groupsThatMatch++;//we find one group links with user 
            };
          });
        };
        
        if (groupsThatMatch == byGroups.length){
            filteredByGroup.push(user);
        };
      };
      //console.log(filteredByGroup +'ahh')
      if (byTags != undefined){
        var userTags = byTags.split(',');
        //console.log(userTags);
        if (user['tags'] != undefined){
          if (user['tags'].filter(function (elem) {
                            return userTags.indexOf(elem) > -1;
                          }).length == userTags.length){
            filteredByTag.push(user);
            filteredcount=filteredcount+1;
          }
        }
      }
      //console.log(filteredByTag +'hh')
      iterator=iterator + 1;
    });
    
    if (byTags != undefined && byGroups != undefined){
      var filteredUsers = _.intersection(filteredByTag,filteredByGroup);
    }
    if (byTags != undefined && byGroups == undefined){
      var filteredUsers = filteredByTag;
    }
    if (byTags == undefined && byGroups != undefined){
      var filteredUsers = filteredByGroup;
    }
    return filteredUsers;
  }
}
