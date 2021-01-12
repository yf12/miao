const express = require('express')

const port = 9092

const app = express()

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
  next()
})

app.get('/', (req, res, next) => {
  res.end('首页')
})

app.get('/question/:id', (req, res, next) => {
  res.end(`您正在查看第${req.params.id}号问题`)
})

app.get('/live/:id', (req, res, next) => {
  res.end(`您正在收听第${req.params.id}号知乎Live`)
})

app.get('/people/:id', (req, res, next) => {
  res.end(`您正在查看用户${req.params.id}的个人页面`)
})

app.listen(port, () => console.log(port))
