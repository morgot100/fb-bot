
var request = require('request');
var config = require('./config');

function sendToAPI(sender, message) {
  return request({
    url: config.messages.url,
    qs: {access_token: config.messages.token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

/**
 * data: {link, image, title, subtitle} or string
 *
 */
function send(sender) {
  return function(data) {
    return sendToAPI(sender, messageData(data));
  }
}

function dataElement(data) {
  var result = {}

    if (data.title) {
      result.title = data.title;
    }
    if (data.subtitle) {
      result.subtitle = data.subtitle;
    }
    if (data.image) {
      result.image_url = data.image;
    }
    if (data.link) {
      result.buttons = [{
        type: "web_url",
        url: data.link,
        title: "Link"
      }];
    }

    return result;
}

function messageData(data) {
  if (typeof data === 'string') {
    return {text: data}
  }

  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: data.map(dataElement)
      }
    }
  }
}

module.exports = {
  send: send
}
