const http = require('http')
const net = require('net')
const url = require('url')

const proxy = http.createServer((req,res) => {
    res.write(200, {'Content-Type': 'text/plain'})
    res.end('ok')
})

proxy.on('connect', (req,cltSocket,head) => {
    const srvUrl = url.parse(`http://${req.url}`)
    const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
        cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                        'Proxy-agent'          
        )
    })
})
