var fs = require('fs')

function readFilePromise(...args) {   //path, encoding
  return new Promise((resolve, reject) => {
    fs.readFile(...args, (err, data) => {
      if(err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

readFilePromise('a.js').then(data => {

}).catch(err => {

})


function writeFilePromise(...args) {   //path, content
  return new Promise((resolve, reject) => {
    fs.writeFile(...args, (err) => {
      if(err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function promisify(callbackBasedFunction) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      callbackBasedFunction(...args, (err, data) => {
        if(err) {
          reject(err)
        } else {
            resolve(data)
        }
      })
    })
  }
}

function callbackfy(promiseBased) {
  return function(...args) {
    var callback = args.pop()
    promiseBased(...args).then(val => {
      callback(null, val)
    }, reason => {
      callback(reason)
    })
  }
}