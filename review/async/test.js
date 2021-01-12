const fs = require('fs')
const bluebird = require('bluebird')
const readFile = bluebird.promisify(fs.readFile)

function* read() {
  let info = yield readFile('./data.txt', 'utf-8')
  let base = yield readFile(info, 'utf-8')
  let age = yield readFile(base, 'utf-8')
  return age
}

let it = read()
let { value, done } = it.next()
value.then((data) => {
  let { value, done } = it.next(data)   //data赋值给了info
  value.then(data => {
    let { value, done } = it.next(data)   //data赋值给了base
    value.then(data => {
      let { value, done } = it.next(data)   //data赋值给了age
      console.log('1', value)
    })
  })
})


//co
const co = require('co')
co(read()).then(data => {
  console.log('2', data)
}).catch(err => {
  console.log(err)
})


//实现co
//接收一个迭代器
function my_co(it) {
  return new Promise((resolve, reject) => {
    function next(data) {
      let { value, done } = it.next(data)
      
      if(!done) {
        value.then(data => {
          next(data)
        })
      } else {
        resolve(value)
      }
    }
    next()
  })
}

function my_co(it) {
  return new Promise((resolve, reject) => {
    function next(data) {
      try {
        var { value, done } = it.next(data)
      } catch(e) {
        return reject(e)
      }
      if(!done) {
        Promise.resolve(value).then(data => {
          next(data)
        }, reject)
      } else {
        resolve(value)
      }
    }
    next()
  })
}

my_co(read()).then(data => {
  console.log('3', data)
}).catch(err => {
  console.log(err)
})
