const http = require('http')
const fs = require('fs')
const path = require('path')

var port = 8080
var base = 'D:/miao/js/node'

var url = path.join()
var isExist = fs.exists(path + '/index.html')

var fileList = fs.readdir(path,{withFileTypes: true})

var sever = http.createServer()
sever.on('request',(request,response) => {
    if(request.url == '/' || request.url == '/index.html') {
        if(isExist) {
            var indexFile = fs.readFileSync(path + '/index.html').toString()
            response.write(indexFile)
        } else {

        }
    } else {
        var fileContent = f.readFileSync(path + request.url).toString()
        if()
    }
})

sever.listen(port,() => {
    console.log('server listening on port', port)
})