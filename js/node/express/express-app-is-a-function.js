const express = require('express')

const port = 9094

const app = express()



app.use((req, res, next) => {
  xxxx
  next()
})

app.use((req, res, next) => {
  xxxx
  next()
})

app.use((req, res, next) => {
  xxxx
  next()
})

app.use((req, res, next) => {
  xxxx
  next()
})


var fns = [next => {
  console.log(1)
  setTimeout(next, 1000)
},next => {
  console.log(2)
  setTimeout(next, 1000)
},next => {
  console.log(3)
  setTimeout(next, 1000)
},next => {
  console.log(4)
  setTimeout(next, 1000)
}]

var composed = fns.reduceRight((previousNext, f) => {
  return function next() {
    f(previousNext)
  }
}, () => {})