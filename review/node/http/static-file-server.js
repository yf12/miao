const http = require('http')
const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const mime = require('mime')
const child_process = require('child_process')

const port = 8091

const baseDir = path.resolve('./')  //显示完整路径

const server = http.createServer()

server.on('request', async (req, res) => {
  var targetPath = decodeURIComponent(path.join(baseDir, req.url))  //解码中文路径

  //      http://localhost:8090/../../../../../../../../etc/passwd
  //                    GET /../../../../../../../../etc/passwd
  //            /home/pi/www/
  //            /desktop/dcim/xxxx.jpg

  //阻止将baseDir以外文件发送出去
  if(!targetPath.startsWith(baseDir)) {
    res.end('hello hacker')
    return
  }

  //阻止发送以点开头的文件夹（隐藏文件）里的文件
  if(targetPath.split(path.sep).some(seg => seg.startsWith('.'))) {
    res.end('hello hacker')
    return    
  }

  try {
    var stat = await fsp.stat(targetPath)
    if(stat.isFile()) {
      var type = mime.getType(targetPath)  //文件编码方式(大概)
      if(type) {
        res.writeHead(200, {'Content-Type': `${type}; charset:UTF-8`})
      } else {
        res.writeHead(200, {'Content-Type': 'application/octet-stream'})  //字节流
      }
      fs.createReadStream(targetPath).pipe(res)
    }
    if(stat.isDirectory()) {
      var indexPath = path.join(targetPath, 'index.html')
      try {   //加载index文件
        await fsp.stat(indexPath)
        res.writeHead(200, {'Content-Type': `text/html; charset:UTF-8`})
        fs.createReadStream(indexPath).pipe(res)
      } catch(e) {  //index.html文件不存在，显示文件夹中文件名
        if(!req.url.endsWith('/')) {
          res.writeHead(301, {
            Location: req.url + '/'
          })
          res.end()
          return
        }
        var entries = await fsp.readdir(targetPath, {withFileTypes: true})
        entries = entries.filter(entry => {
          return !entry.name.startsWith('.')
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
        // child_process.exec('ls -lha', (err, stdout) => {
        //   console.log(stdout,err)
        //   res.end(stdout)
        // })
      }
    }
  } catch(e) {
    res.writeHead(404, {
      'Content-Type': 'text/html; charset:UTF-8'
    })
    res.end('404 Not Found')
  }
})

server.listen(port, () => {
  console.log('server listening on port', port)
})
