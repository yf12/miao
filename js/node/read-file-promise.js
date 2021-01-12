var fs = require('fs')
var fsp = fs.promises

var utils = require('utils')
var readFilePromise = utils.promisify(fs.readFile)

function readFilePromise(...args) {   //path
    return new Promise((resolve,reject) => {
        fs.readFile(...args,(err,data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

readFilePromise('a.js').then(data => {

}).catch(err => {

})

function writeFilePromise(...args) {   //path,content
    return new Promise((resolve,reject) => {
        fs.writeFile(...args,(err) => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

function promisify(callbackBasedFunction) {
    return function(...args) {
        return new Promise((resolve,reject) => {
            callbackBasedFunction(...args,(err,data) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })        
    }
}

readFilePromise = promisify(fs.readFile)
writeFilePromise = promisif(fs.writeFile)
statPromise = promisify(fs.stat)
unlinkPromise = promisify(fs.unlink)


function callbackify(promiseBased) {
    return function(...args) {
        var callback = args.pop()
        promiseBased(...args).then(val => {
            callback(null,val)
        },reason => {
            callback(reason)
        })
    }
}

function listAllFilesSync(dirPath,result = []) {
    var allFiles = fs.readdirSync(dirPath)
    for(let i = 0;i < allFiles.length;i++) {
        var path = dirPath + '/' + allFiles[i]
        if(fs.statSync(path).isFile()) {
            result.push(allFiles[i])
        } else {
            listAllFilesSync(path,result)
        }
    }
    return result
}
listAllFilesSync('D:/miao/js/todo')

function listAllFilesCallback(dirPath,cb,result = []) {
    fs.readdir(dirPath,'utf8',(err,data) => {
        var count = 0
        data.forEach(file => {
            var path = dirPath + '/' + file
            if(fs.statSync(path).isFile()) {
                result.push(file)
                count++
                if(count == data.length) {
                    cb(result)
                }                
            } else {
                listAllFilesCallback(path,() => {
                    count++
                    if(count == data.length) {
                        cb(result)
                    }
                },result)
            }
        })
    })
}
listAllFilesCallback('D:/miao/js/todo',function cb(result) {console.log(result)},[])

function listAllFilesPromise(dirPath) {
    var result
    var filePromise = fsp.readdir(dirPath)
}

var files = listAllFiles('d:/')

listAllFiles('d:/',(err,files) => {

})

listAllFiles('d:/').then(files => {
    
},err => {

})