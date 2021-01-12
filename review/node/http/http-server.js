const http = require('http')

const server = http.createServer()

const port = 3020

server.on('request', (request, response) => {
  const ip = request.socket.remoteAddress;
  const port = request.socket.remotePort;
  response.writeHead(200, {
    'Content-type': 'text/html; charset=UTF-8'
  })
  response.end(`hello您的 IP 地址是 ${ip}，您的源端口是 ${port}`);
})

server.listen(port, () => {
  console.log('server listening on port', port)
})


// class HttpServer {
//   constructor(requestHandler) {
//     var net = require('net')
//     this.server = net.createServer(conn => {
//       var head = parse() //parse data comming from conn
//       if(isHttp(conn)) {
//         requestHandler(new RequestObject(conn), new ResponseObject(conn)) //封装request response对象
//       } else {
//         conn.end()
//       }
//     })
//   } 

//   listen(port, f) {
//     this.server.listen(port, f)
//   }
// }



















// HttpServer