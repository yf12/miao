var yf12 = function(){   
    function chunk(ary,size = 1) {
        if(size == 0) return []
        var result = []
        let l = (ary.length / size) === (Math.floor(ary.length / size)) ? ary.length / size : Math.floor(ary.length / size) + 1
        let j = 0
        for(let i = 0;i < l;i++) {
            var array = [],count = 0
            while(count < size && ary[j]) {
                array.push(ary[j])
                j++
                count++
            }
            result.push(array)
        }
        return result
    }

    function compact(ary) {
        return ary.filter(it => it)
    }

    function slice(ary,start = 0,end = ary.length) {
        if(end > ary.length) end = ary.length
        let result = []
        for(let i = start;i < end;i++) {
            result.push(ary[i])
        }
        return result
    }

    function reduce(map,combine,initialValue) {
        if(arguments.value == 2) {
            initialValue = map[0]
        }
        for(let i = 1;i < map.length;i++) {
            initialValue = combine(initialValue,map[i],i,map)
        }
        return initialValue
    }

    function negate(f) {
        return function(...args) {
            return !f(...args)
        }
    }

    function flatten(ary) {
        let result = []
        for(let item of ary) {
            if(Array.isArray(item)) {
                result.push(...item)
            } else {
                result.push(item)
            }
        }
        return result
    }

    function flattenDeep(ary) {
        let result = []
        for(let item of ary) {
            if(Array.isArray(item)) {
                let flattedItem = flattenDeep(item)
                result.push(...flattedItem)
            } else {
                result.push(item)
            }
        }
        return result
    }

    function flattenDepth(ary,depth = 1) {
        if(depth == 0) return ary.slice()
        let result = []
        for(let item of ary) {
            if(Array.isArray(item)) {
                let flattedItem = flattenDepth(item,depth - 1)
                result.push(...flattedItem)
            } else {
                result.push(item)
            }
        }
        return result
    }

    function curry(f,length = f.length) {
        return function(...args) {
            if(args.length >= length) {
                return f(...args)
            } else {
                return curry(f.bind(null,...args),length - args.length)
            }
        }
    }

    function difference(ary,...array) {
        let result = []
        for(let i = 0;i < ary.length;i++) {
            let flag = false
            for(let j = 0;j < array.length;j++) {
                if(array[j].indexOf(ary[i]) >= 0) {
                    flag = true
                    break
                }
            }
            if(!flag) {
                result.push(ary[i])
            }            
        }
        return result
    }

    function toPath(str) {   //a.b.0.c[fooo][bar].d
        return str.split(/\.|\[|\]./g)
    }

    function get(obj,path,defaultVal) {
        var path = toPath(path)
        for(var i = 0;i < path.length;i++) {
            if(obj == undefined) {
                return defaultVal
            } else {
                obj = obj[path[i]]
            }
        }
        return obj
    }

    function property(path) {
        return function(obj) {
            return get(obj,path)
        }
    }

    function differenceBy(ary,...array) {
        let func = array.pop()
        if(typeof func == 'object') {
            array.push(func)
            return difference(ary,...array)
        }
        let result = []
        if(typeof func == 'string') {
            if(/\=\>/.exec(func)) {
                let prams = func.match(/(.+)\s\=\>/)[1]
                let returnval = func.match(/\=\>\s(.+)/)[1]
                func = new Function(prams,'return' + ' ' + returnval)
            } else {
                func = property(func)
            }
        }
        for(let i = 0;i < ary.length;i++) {
            let flag = true
            for(let j = 0;j < array.length;j++) {
                let aryf = array[j].map(func)
                if(aryf.indexOf(func(ary[i])) >= 0) {
                    flag = false
                    break
                }
            }
            if(flag) {
                result.push(ary[i])
            }
        }
        return result
    }

    return {
        chunk,
        compact,
        slice,
        reduce,
        negate,
        flatten,
        flattenDeep,
        flattenDepth,
        curry,
        difference,
        toPath,
        get,
        property,
        differenceBy
    }
}()