const express = require('express')

const port = 9091

const app = express()


app.get('/foo', (req, res, next) => {
  console.log(req.url)
  res.end('getget')
})

app.use('/static', (req, res, next) => {
  console.log(req.url)
  res.end('helo')
})

app.listen(port, () => {
  console.log(port)
})