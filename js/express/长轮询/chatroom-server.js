const express = require('express')
const port = 3000
const app = express()

var pendingResponses = []

app.use(express.urlencoded({extended: true}))

app.get('/',(req,res,next) =>{
    res.sendFile(__dirname + '/index.html')
})

app.get('/msg',(req,res,next) => {
    pendingResponses.push(res)
})

app.post('/msg',(req,res,next) => {
    pendingResponses.forEach(response => {
        response.end(req.body.message)
    })
    pendingResponses.length = 0
    res.end()
})

app.listen(port, () => {
    console.log('listening on port', port)
})
