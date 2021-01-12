const fs = require('fs')
const fsp = fs.promises

function listAllFilesSync(path) {
    var result = []
    var stat = fs.statSync(path)
    if(stat.isFile()) {
        return [path]
    } else {
        var entries = fs.readdirSync(path,{withFileTypes: true})
        entries.forEach(entry => {
            var fullPath = path + '/' + entry.name
            var files = listAllFilesSync(fullPath)
            result.push(...files)
        })
        return result
    }
}
console.log(listAllFilesSync('D:/miao/js/todo'))


// function listAllFilesPromise(path) {
//     return fsp.stat(path).then(stat => {
//         if(stat.isFile()) {
//             return [path]
//         } else {
//             return fsp.readdir(path,{withFileTypes: true}).then(entries => {
//                 return Promise.all(entries.map(entry => {
//                     var fullPath = path + '/' + entry.name
//                     return listAllFilesPromise(fullPath)
//                 }))
//             })
//         }
//     }).then(arrays => {
//         return [].concat(...arrays)
//     })
// }
// listAllFilesPromise('D:/miao/js/todo').then(console.log)


function listAllFilesPromise(path) {
    return fsp.stat(path).then(stat => {
        if(stat.isFile()) {
            return [path]
        } else {
            return fsp.readdir(path,{withFileTypes: true}).then(entries => {
                return Promise.all(entries.map(entry => {
                    var fullPath = path + '/' + entry.name
                    return listAllFilesPromise(fullPath)
                }))
            })
        }
    }).then(arrays => {
        return [].concat(...arrays)
    })
}
listAllFilesPromise('D:/miao/js/todo').then(console.log)


function listAllFilesCallback(path,callback) {
    fs.stat(path,(err,stat) => {
        if(stat.isFile()) {
            callback([path])
        } else {
            fs.readdir(path,{withFileTypes: true},(err,entries) => {
                var result = []
                var count = 0
                entries.forEach((entry,i) => {
                    var fullPath = path + '/' + entry.name
                    listAllFilesCallback(fullPath,(files) => {
                        result[i] = files
                        count++
                        if(count == entries.length) {
                            callback([].concat(...result))
                        }
                    })
                })
            })
        }
    })
}
listAllFilesCallback('D:/miao/js/todo',console.log)