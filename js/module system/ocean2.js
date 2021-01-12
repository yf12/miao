(function() {

  var seajs = {
    use: function(entryPath) {
      loadAll(entryPath, () => {
        require(entryPath)
      })
    }
  }

  window.seajs = seajs

  function require(path) {
    if (moduleCache[path]) {
      return moduleCache[path]
    }
    var modFunc = modFuncCache[path]
    // var modFunc = new Function('module, exports, require', code)
    var module = {exports: {}}
    modFunc(require, module.exports,module)
    moduleCache[path] = module.exports
    return module.exports
  }

  var moduleCache = {}//模块导出对象的缓存
  var sourceCache = {}//模块源代码的缓存
  var modFuncCache = {}

  /**
   * 给定文件路径，加载其内容及其依赖的所有文件的内容并缓存
   * 完成后调用callback
   * 用于通知调用者已经加载完成了
   */
  function loadAll(path, callback) {//is-narrsssisistic.js
    readFile(path, (modFunction) => {
      modFuncCache[path] = modFunction

      var deps = getDeps(modFunction.toString())//['digit-width.js', 'power.js']

      if (deps.length === 0) {
        callback()
        return
      }

      var loadedCount = 0
      deps.forEach(dep => {
        loadAll(dep, () => {
          loadedCount++
          if (loadedCount == deps.length) {
            callback()
          }
        })
      })
    })
  }

  /**
   * 给定一份源代码，返回其依赖
   * 即每个require调用的参数组成的数组
   */
  function getDeps(sourceCode) {
    var requireCalls = sourceCode.match(/require\s*\(\s*(['"])([^'"]*)\1\s*\)/g)

    if (requireCalls) {
      return requireCalls.map(call => {
        return call.match(/require\s*\(\s*(['"])([^'"]*)\1\s*\)/)[2]
      })
    } else {
      return []
    }
  }

  /**
   * 给定文件路径，加载完成后调用done
   * 并传入文件内容
   */
  function readFile(path, done) {
    var script = document.createElement('script')
    script.onload = function() {
      document.head.removeChild(script)
      done(tmpModFunc)
    }
    script.src = path
    document.head.appendChild(script)
  }

  var tmpModFunc

  window.define = function(f) {
    tmpModFunc = f
  }

  

}())