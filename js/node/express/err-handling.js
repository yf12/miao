const express = require('express')

const port = 9094

const app = express()


app.use((req, res, next) => {
  console.log(0)
  next(8)
})

app.use((req, res, next) => {
  console.log(1)
  next()
})


app.use((err, req, res, next) => {
  console.log(2)
  console.log(err)
  next()
})


app.use((req, res, next) => {
  console.log(3)
  throw 9
  next()
})

app.use((req, res, next) => {
  console.log(4)
  next()
})

app.use((err, req, res, next) => {
  console.log(5)
  console.log(err)
  next()
})

app.listen(port, () => console.log(port))