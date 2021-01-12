const {createServer} = require('http')

var {parse} = require('url')
var {resolve,sep} = require('path')  

const methods = Object.create(null)

const {createReadStream} = require('fs')
const {stat,readdir} = require('fs').promises
const mime = require('mime')

const {rmdir,unlink} = require('fs').promises

const {createWriteStream} = require('fs')

const {mkdir} = require('fs')

function urlPath(url) {
    let {pathname} = parse(url)
    let path = resolve(decodeURIComponent(path))
}

methods.GET = async function(request) {
    let path = urlPath(request.url)
    let stats
    try {
        stats = await stat(path)
    } catch(error) {
        if(error.code != "ENOENT") throw error
        else return {status: 404,body:"File not found"}
    }
    if(stat.isDirectory()) {
        return {body: (await readdir(path,{withFileTypes: true})).map(entry => {
            if(entry.isFile()) {
                return entry.name
            } else {
                return entry.name + '/'
            }
        }).join('\n')}
    } else {
        return {body: createReadStream(path),
                type: mime.getType(path)}
    }
}

methods.DELETE = async function(request) {
    let path = urlPath(request.url)
    let stats
    try {
        stats = await stat(path)
    } catch(error) {
        if(error.code != "ENOENT") throw error
        else return {status: 204}
    }
    if(stats.isDirectory()) await rmdir(path)
    else await unlink(path)
    return {status: 204}
}

function pipeStream(from,to) {
    return new Promise((resolve,reject) => {
        from.on('error',reject)
        to.on('error',reject)
        to.on('finish',resolve)
        from.pipe(to)
    })
}

methods.PUT = async function(request) {
    let path = urlPath(request.url)
    await pipeStream(request,createWriteStream(path))
    return {status: 204}
}

methods.MKCOL = async function(request) {
    let path = urlPath(request)
    let stats
    try {
        stats = stat(path)
    } catch(error) {
        if(error != 'ENOENT') throw error
        await mkdir(path)
        return {status: 204}
    }
    if(stats.isDirectory()) return {status: 204}
    else return {status:400, body: "Not a directory"}
}

methods.OPTIONS = async function(request) {
    return {
        status: 200
    }
}