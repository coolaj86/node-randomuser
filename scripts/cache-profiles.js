'use strict';

var request = require('request')
  , data = require('../cache/data')
  , fs = require('fs')
  , path = require('path')
  , count = 0
  , increment = 500
  ;

console.log("We currently have", data.results.length, "profiles... ");
console.log("and we're gonna get", increment, "more!!!");

function write() {
  console.log(data.results.length, 'total profiles accumulated');
  console.log('Saving...');
  fs.writeFile(path.resolve(__dirname, '../cache/data.json'), JSON.stringify(data, null, '  '), function (err) {
    if (err) {
      console.error('ERROR!!');
      console.error(err);
      return;
    }

    console.log('Saved!');
  });
}

function getMore() {
  request.get('http://api.randomuser.me/?randomapi&results=1000', function (err, resp, body) {
    var response = JSON.parse(body)
      ;

    response.results.forEach(function (result) {
      function findUser(user) {
        return result.seed === user.seed;
      }
      if (!data.results.some(findUser)) {
        count += 1;
        result.user.picture = 'http://images.coolaj86.com/api/resize/width/350/' + encodeURIComponent(result.user.picture);
        data.results.push(result);
      }
    });

    console.log('Accumulated ' + count + ' new profiles');
    if (count < 500) {
      getMore();
    } else {
      console.log("Okay, that's enough for now. :-)");
      write();
    }
  });
}

getMore();
