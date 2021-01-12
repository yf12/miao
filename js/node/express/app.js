const express = require('express')

const port = 9090
const server = express()

const static = require('./static')
const bodyParser = require('./body-parser')
const cors = require('cors')


server.use((req, res, next) => {
  console.log(req.method, req.url)
  req.startTime = Date.now()
  next()
})

server.use(cors())

server.use(express.static('./public'))

server.use(express.json())

server.use(express.urlencoded())



server.use((req, res, next) => {
  var time = Date.now() - req.startTime
  console.log('rquest task', time, 'ms')
})

server.listen(port, () => {
  console.log('listening on port', port)
})