const http = require('http')
const fs = require('fs')
const path = require('path')

const port = 9000
const baseDir = __dirname

const server = http.createServer((req,res) => {
    console.log(req.method,req.url)

    var targetPath = path.join(baseDir,req.url)
    fs.stat(targetPath,(err,stat) => {
        if(err) {
            res.writeHead(404, {
                'Content-Type': 'text/html; charset=UTF-8'
            })
            res.end('404 Not Found')
        } else {
            if(stat.isFile()) {
                fs.readFile(targetPath,(err,data) => {
                    res.end(data)
                })
            } else if(stat.isDirectory()){
                var indexPath = path.join(targetPath,'index.html')
                fs.stat(indexPath,(err,stat) => {
                    if(err) {
                        if(!req.url.endsWith('/')) {
                            res.writeHead(301,{
                                'Location': req.url + '/'
                            })
                            res.end()
                            return
                        }
                        fs.readdir(targetPath,{withFileTypes: true},(err,entries) => {
                            res.end(`
                                ${
                                    entries.map(entry => {
                                        var slash = entry.isDirectory() ? '/' : ''
                                        return `
                                            <div>
                                                <a href="${entry.name}${slash}">${entry.name}${slash}</a>
                                            </div>
                                        `
                                    }).join('')
                                }
                            `)
                        })
                    } else {
                        fs.readFile(indexPath,(err,data) => {
                            res.end(data)
                        })
                    }
                })
            }
        }
    })
})

server.listen(port, () => {
    console.log(port)
  })
  