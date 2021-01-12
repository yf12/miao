const http = require('http')
const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const mime = require('mime')

const port = 8090
const baseDir = path.resolve('./')

const server = http.createServer(async (req,res) => {
    console.log(req.method,req.url)

    var targetPath = decodeURIComponent(path.join(baseDir,req.url))
    
    if(!targetPath.startsWith(baseDir)) {
        res.end('hello hacker')
        return
    }

    if(targetPath.split(path.sep).some(seg => seg.startsWith('.'))) {
        res.end('hello hacker')
        return        
    }
    
    try {
        var stat = await fsp.stat(targetPath)
        if(stat.isFile()) {
            var data = await fsp.readFile(targetPath)
            var type = mime.getType(targetPath)
            if(type) {
                res.writeHqead(200,{'Content-Type': `${type}; charset=UTF-8`})
            } else {
                res.writeHead(200,{'Content-Type': `application/octet-stream`})
            }
            res.end(data)
        } else if(stat.isDirectory()) {
            var indexPath = path.join(targetPath,'index.html')
            try {
                await fsp.stat(indexPath)
                var indexContent = await fsp.readFile(indexPath)
                var type = mime.getType(indexPath)
                if(type) {
                    res.writeHead(200,{'Content-Type': `${type}; charset=UTF-8`})
                } else {
                    res.writeHead(200,{'Content-Type': `application/octet-stream`})
                }
                res.end()
                return

            } catch(e) {
                if (!req.url.endsWith('/')) {//如果地址栏里不/结尾，跳转到以/结尾的相同地址
                    res.writeHead(301, {
                      'Location': req.url + '/'
                    })
                    res.end()
                    return
                }
                
                var entries = await fsp.readdir(targetPath,{withFileTypes: true})

                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=UTF-8'
                })
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
            }
        }

    } catch(e) {
        res.writeHead(404, {
            'Content-Type': 'text/html; charset=UTF-8'
        })
        res.end('404 Not Found')
    }
})

server.listen(port, () => {
    console.log(port)
})