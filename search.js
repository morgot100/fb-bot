var request = require('request');
var config = require('./config');
var logger = require('./logger');
var Promise = require('bluebird');

var search = function(imageOnly) {
  return function (text) {
    return new Promise(function(resolve, reject) {
      request.get(makeRequest(text), function(error, response, body) {
        var data = JSON.parse(body);

        if (error || data.error) {
          var err = error || data.error;
          logger.error(err);
          return reject(err.message);
        }

        var results = data.items
          .map(normalizeResponse(imageOnly))
          .filter(function(item) { return !imageOnly || item.image });

        return resolve(results);
      });
    })
  }
}

function normalizeResponse(imageOnly) {
  return function(item) {
    var message = {
      title: '__',
      link: item.link,
      image: (item.imageobject || {}).url || ((item.pagemap.cse_image || [])[0] || {}).src
    }
    if (!imageOnly) {
      message.title = item.title,
      message.subtitle = item.pagemap.newsarticle ? item.pagemap.newsarticle.description : item.snippet
    }

    return message;
  }
}

function makeRequest(text) {
  var q = '&q=' + encodeURIComponent(text);
  return config.search.url + q;
}

module.exports = search
