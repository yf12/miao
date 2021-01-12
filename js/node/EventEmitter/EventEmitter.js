import { networkInterfaces } from "os"
import { request } from "https"

class EventEmitter {
    constructor() {
        this._events = {}
    }

    on(type,handler) {

    }

    off(type,handler) {

    }

    emit(type,...args) {

    }
}


class HttpSrever extends EventEmitter {
    constructor() {
        this.tcpServer = new net.Server()

        this.tcpServer.on('connerction',conn => {
            conn.on('data',data => {
                if(data) {   //if括号内 data is a http request
                    var httpRequet = parse(data)
                    var httpResponse
                    this.emit('request',httpRequet,httpResponse)
                }
            })
        })
    }
}

function createServer(requestHandler,options) {
    var server = new http.Server(options)
    server.on('request',requestHandler)
    return server
}

server = createServer()

server.on('request',(req,res) => {

})