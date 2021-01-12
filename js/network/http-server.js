var net = require('net')

var server = net.createServer()

var port = 80

server.on('connection',conn => {
    conn.on('data',data => {
        var path = data.toString().split('\r\n')[0].split(' ')[1]
        console.log(path)
        conn.write(
`HTTP/1.1 200 OK
Content-Type: text/html
Data: ${new Date().toISOString()}

<h1>hello, now is ${new Date().toLocaleString()}</h1>`)
        conn.end()
    })
    conn.on('error',()=> {})
})

server.listen(port,() => {
    console.log('server listening on port',port)
})
