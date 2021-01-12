module.exports = function(dir) {
  return async (req, res, next) => {
    var path = require('path')
    var fsp = require('fs').promises
    var base = dir
    var targetPath = path.join(base, req.url)
    try {
      var stat = await fs.stat(targetPath)
      if (stat.isFile()) {
        fsp.createReadStream(targetPath).pipe(res)
      } else {
        next()
      }
    } catch(e) {
      next()
    }
  }
}