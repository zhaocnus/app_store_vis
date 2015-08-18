/**
 * This module is a prettier console for nodejs
 **/

'use strict';

var colog = require('colog');

module.exports.inline = function (msg, clearLine) {
  if (clearLine) {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
  }

  process.stdout.write('    ' + msg + '  ');
}

module.exports.header = function (msg) {
  colog.log(
    colog.bold(
      colog.underline('*   ' + msg + '\n')
    )
  );
}

module.exports.header2 = function (msg) {
  colog.log(
    colog.underline('**  ' + msg + '\n')
  );
}

module.exports.dividor = function () {
  colog.log('    ------------------------------------------------------');
}

module.exports.newLine = function (msg) {
  colog.newLine();
}

module.exports.log = function (msg) {
  colog.log('    ' + msg);
}

module.exports.error = function (msg) {
  colog.error('    ' + msg);
}

