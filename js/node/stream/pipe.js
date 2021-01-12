ReadableStream.prototype.pipe = function(writable) {
    var rs = this
    rs.on('data',data => {
        if(writable.write(data) === false) {
            rs.pause()
        }
    })
    rs.on('end',() => {
        writable.end()
    })
    writable.on('drain',() => {
        rs.resume()
    })
    return writable
}