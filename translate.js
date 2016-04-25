var request = require('request');
var config = require('./config');
var logger = require('./logger');
var Promise = require('bluebird');

var translate = function(from, to) {
  return function(text) {
    return new Promise(function(resolve, reject) {
      request.get(makeRequest(from, to, text), function(error, response, body) {
        var data = JSON.parse(body);

        if (error || data.error) {
          var err = error || data.error;
          logger.error(err);
          return reject(err.message);
        }

        var translated = data.data.translations[0].translatedText;
        return resolve(translated);
      });
    })
  }
}

function makeRequest(from, to, text) {
  var q = '?q=' + encodeURIComponent(text) + '&source=' + from + '&target=' + to + '&key=' + config.translate.token;
  return config.translate.url + q;
}

module.exports = translate;
