class EventEmmiter {
    constructor() {
        this.event = []
        this.callback = []
    }

    on(event,callback) {
        this.event.push(event)
        this.callback.push(callback)
    }

    off(event) {
        var idx = this.event.indexOf(event)
        if(idx >= 0) {
            this.event = this.event.slice(0,idx).concat(this.event.slice(idx + 1))
            this.callback = this.callback.slice(0,idx).concat(this.callback.slice(idx + 1))
        }
    }

    emit(event,...args) {
        var idx = this.event.indexOf(event)
        if(idx >= 0) {
            this.callback[idx](...args)
        }
    }
}
  
  
var emmiter = new EventEmmiter()
emmiter.on('foo', () => {console.log(1)})

emmiter.emit('foo')//will log 1
