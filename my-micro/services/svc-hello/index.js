'use strict'

exports.hello_nz = (event, context, callback) => {
  const msg = 'HelloWorld NZ! 3'

  console.log(msg)
  callback(null, msg)
}

exports.hello_world = (event, context, callback) => {
  const msg = 'HelloWorld World! 4'

  console.log(msg)
  callback(null, msg)
}

exports.hello_universe = (event, context, callback) => {
  const msg = 'HelloWorld Universe! 2'

  console.log(msg)
  callback(null, msg)
}
