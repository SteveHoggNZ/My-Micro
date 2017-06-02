'use strict';

exports.hello = (event, context, callback) => {
  const msg = 'Hello World!!!!!!!!!!!!!!'

  console.log(msg)
  callback(null, msg)
}
