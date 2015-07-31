/**
 * database util module
 *
 **/

'use strict';

/**
 * Returns string to be used by "ON DUPLICATE KEY UPDATE" for multiple items
 * REF: (http://stackoverflow.com/a/450695/2259286)
 * cols: array
 */
function getBulkDuplicateUpdateStr(cols) {
  var str = '';

  cols.forEach(function (value, i) {
    var col = value.field;
    var colStr = '`' + col + '`';

    if (i !== 0) {
      str += ',';
    }

    str += colStr + '=VALUES(' + colStr + ')';
  });

  return str;
}

module.exports = {
  getBulkDuplicateUpdateStr: getBulkDuplicateUpdateStr
};