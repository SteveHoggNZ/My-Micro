'use strict';

exports.prerelease = (event, context, callback) => {
  const msg = 'Hi There World!'

  console.log(msg)
  callback(null, msg)
}
