var net = require('net')
var server = net.createServer()
var port = 8080

server.on('connection',conn => {
    conn.on('data',data => {
        var request = data.toString()
        var [firsLine,secondLine,...headers] = request.split('\r\n')

        if(accept == 'text/plain') {
            conn.write(html.toString())
        } else if(accept == 'text/html') {
            conn.write(`html`)
        } else if(accept == 'application/json') {
            conn.write(JSON.stringify(html))
        }
    })

})



server.listen(port,() => {
    console.log('server listening on port', port)
})