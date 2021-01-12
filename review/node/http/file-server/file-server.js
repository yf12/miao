const {createServer} = require('http')
const port = 3100

const methods = Object.create(null)

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed

  handler(request)
    .catch(error => {
      if (error.status) return error
      else return {body: String(error), status: 500}
    })
    .then(({body, status = 200, type = 'text/html'}) => {
      response.writeHead(status, {
        "Content-Type": type,
        "Access-Control-ALlow-Origin": "*",
        "Access-Control-ALlow-Methods": "GET, DELETE, MKCOL, PUT"
      })

      if (status == 301) {
        response.writeHead(301, {
          Location: request.url + '/'
        })
        response.end()
        return
      }
      if (body && body.pipe) 
        body.pipe(response)
      else {
        response.end(body)
      }
    })
}).listen(port, () => {console.log('server listening on port', port)})

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed`
  }
}

var {parse} = require('url')
var {resolve, join, sep} = require('path')

var baseDir = resolve('./')

function urlPath(url) {
  var pathname = parse(url).pathname
  var path = join(baseDir, decodeURIComponent(pathname))
  // var path = resolve(decodeURIComponent(pathname).slice(1))
  if (path !== baseDir && !path.startsWith(baseDir + sep)) {   //不能直接startsWith(baseDir)么?
    throw {status: 403, body: 'Forbidden'}
  } 
  return path
}

const {createReadStream} = require('fs')
const {stat, readdir} = require('fs').promises
const mime = require('mime')

methods.GET = async function(request) {
  let path = urlPath(request.url)
  let stats
  try {
    stats = await stat(path)
  } catch(error) {
    if (error.code != 'ENOENT') throw error
    else return {status: 404, body: 'File not found'}
  }
  if (stats.isFile()) {
    return {
      body: createReadStream(path),
      type: mime.getType(path)
    }
  } 
  if (stats.isDirectory()) {
    if (!request.url.endsWith('/')) {
      return {
        status: 301
      }
    }
    let entries = await readdir(path, {withFileTypes: true})
    entries = entries.filter(entry => {
      return !entry.name.startsWith('.')
    })
    return {
      body: `
        ${
          entries.map(entry => {
            var slash = entry.isDirectory() ? '/' : ''
            return `
              <div>
                <a href="${entry.name}${slash}">${entry.name}${slash}</a>
              </div>
            `
          }).join('\n')
        }
      `,
      type: 'text/html'
    }
  }
}

const {unlink, rmdir} = require('fs').promises

methods.DELETE = async function(request) {
  let path = urlPath(request.url)
  let stats
  try {
    stats = await stat(path)
  } catch(error) {
    if (error.code != 'ENOENT') throw error
    else return {status: 204}
  }
  if (stats.isFile()) await unlink(path)
  else await rmdir(path)
  return {status: 204}
}

const {createWriteStream} = require('fs')

function pipeStream(from, to) {
  return new Promise((resolve, reject) =>{
    from.on("error", reject)
    to.on("error", reject)
    to.on("finish", resolve)
    from.pipe(to)
  })
}

methods.PUT = async function(request) {
  let path = urlPath(request.url)
  await pipeStream(request, createWriteStream(path))
  return {status: 204}
}

const {mkdir} = require('fs').promises

methods.MKCOL = async function(request) {
  let path = urlPath(request.url)
  let stats
  try {
    stats = await stat(path)
  } catch(error) {
    if (error.code != 'ENOENT') throw error
    else {
      await mkdir(path)
      return {status: 204}
    }
  }
  if (stats.isDirectory()) return {status: 204}
  else return {status: 400, body: 'Not a directory'}
}
