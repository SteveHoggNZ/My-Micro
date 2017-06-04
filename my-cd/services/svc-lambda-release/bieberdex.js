'use strict';

exports.hello = (event, context, callback) => {
  const msg = 'Hi There World!'

  console.log(msg)
  callback(null, msg)
}
