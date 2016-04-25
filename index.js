var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var config = require('./config');
var commands = require('./commands');
var API = require('./fbAPI');
var app = express();


app.use(bodyParser.json());

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'test-token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;

  messaging_events.forEach(function(event) {
    var send = API.send(event.sender.id)

    if (event.message && event.message.text) {
      var text = event.message.text;
      commands(text)
        .then(function(result) {
          send(result);
        })
        .catch(function(err) {
          send(err);
        })
    }
  });

  res.sendStatus(200);
});

app.listen(8080, function () {
  console.log('Bot is listening on port 8080!');
});
