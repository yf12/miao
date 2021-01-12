const fs = require('fs')
const fsp = fs.promises

function listAllFilePromise(path) {
  return fsp.stat(path).then(stats => {
    if(stats.isFile()) {
      return [path]
    } else {
      return fsp.readdir(path, {withFileTypes: true}).then(files => {
        return Promise.all(files.map(file => {
          var fullPath = path + '/' + file.name
          return listAllFilePromise(fullPath)
        }))
      })
    }
  }).then(result => {
    return [].concat(...result)
  })
}

function listAllFileCallback(path, callback) {
  fs.stat(path, (err, stats) => {
    if(stats.isFile()) {
      callback([path])
    } else {
      fs.readdir(path, {withFileTypes: true}, (err, files) => {
        var count = 0
        var result = []
        if(files.length == 0) {
          callback([])
        } else {
          files.forEach((file, i) => {
            var fullPath = path + '/' + file.name
            listAllFileCallback(fullPath, (thisfiles) => {
              count++
              result[i] = thisfiles
              if(count == files.length) {
                callback([].concat(...result))
              }
            })
          })
        }
      })
    }
  })
}

// function listAllFileCallback(path, callback) {
//   fs.stat(path, (err, stats) => {
//     if(stats.isFile()) {
//       callback([path])
//     } else {
//       fs.readdir(path, {withFileTypes: true}, (err, files) => {
//         var count = 0
//         var result = []
//         if(files.length == 0) {
//           callback([])
//         } else {
//           files.forEach((file, i) => {
//             var fullPath = path + '/' + file.name
//             listAllFileCallback(fullPath, (thisfiles) => {
//               count++
//               result.push(...thisfiles)
//               if(count == files.length) {
//                 callback([].concat(...result))
//               }
//             })
//           })
//         }
//       })
//     }
//   })
// }

listAllFilePromise('./aaa').then(r => console.log(1, r))

listAllFileCallback('./aaa', r => {console.log(2, r)})