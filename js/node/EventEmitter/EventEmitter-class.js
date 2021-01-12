class EventEmitter {
    constructor() {
      this._events = {}
    }
  
    on(type, handler) {
      if (type in this._events) {
        this._events[type].push(handler)
      } else {
        this._events[type] = [handler]
      }
      return this
    }
  
    off(type, handler) {
      var listeners = this._events[type]
      
      this._events[type] = listeners.filter(it => it != handler)
  
      // if (listeners) {
      //   var idx = listeners.indexOf(handler)
      //   if (idx >= 0) {
      //     listeners.splice(idx, 1)
      //   }
      // }
  
      return this
    }
  
    emit(type, ...args) {
      var listeners = this._events[type]
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          var handler = listeners[i]
          handler.call(this, ...args)
        }
      }
    }
  }
  class HttpServer extends EventEmmiter {
    constructor(){
      this.tcpServer = new net.Server()
  
      this.tcpServer.on('connection', conn => {
        conn.on('data', data => {
          if (data is a http request) {
            var httpRequest = parse(data)
            var httpResponse = new 
            this.emit('request', httpRequest, httpResponse)
          }
        })
      })
    }
  }
  
  
  function createServer(requestHandler, options) {
    var server = new http.Server(options)
    server.on('request', requestHandler)
    return server
  }
  
  
  server = http.createServer()
  
  server.on('request', (req, res) => {
  
  })
  