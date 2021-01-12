var fs = require('fs')
var fsp = fs.promises

function listAllFilesPromise(dirPath,result = []) {
    var filePromise = fsp.readdir(dirPath)
    return filePromise.then(files => {
        for(let i = 0;i < files.length;i++) {
            var path = dirPath + '/' + files[i]
            if(fs.statSync(path).isFile()) {
                result.push(files[i])
            } else {
                listAllFilesPromise(path,result)
            }
        }
    })
}

listAllFilesPromise('D:/miao/js/todo').then(console.log)