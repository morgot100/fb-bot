var translate = require('./translate');
var search = require('./search');
var Promise = require('bluebird');

var COMMAND_SYMBOL = '.';
var COMMANDS = {
  't': {
    exec: translate('en', 'ru'),
    desc: 'Translate EN -> RU'
  },
  'т': {
    exec: translate('ru', 'en'),
    desc: 'Translate RU -> EN'
  },
  's': {
    exec: search(),
    desc: 'Google search'
  },
  'i': {
    exec: search(true),
    desc: 'Image search'
  }
}

function execute(text) {
  return new Promise(function(resolve, reject) {
    if (text[0] !== COMMAND_SYMBOL) {
      return reject(getHelpText());
    }

    var command = text.slice(1, text.indexOf(' ')).toLowerCase(); // from COMMAND_SYMBOL to first space
    var argument = text.slice(text.indexOf(' ') + 1);

    if (command && COMMANDS[command]) {
      return resolve(COMMANDS[command].exec(argument))
    }

    return reject(getHelpText());
  })
}

function getHelpText() {
  return Object.keys(COMMANDS)
    .map(function(command) {
      return COMMAND_SYMBOL + command + ' - ' + COMMANDS[command].desc + '\n';
    })
    .reduce(function(all, curr) {
      return all + curr;
    }, 'Available commands:\n');
}

module.exports = execute;
