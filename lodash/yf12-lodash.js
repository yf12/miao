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

    function isMatch(obj,src) {
        if(obj == src) return true
        for(let key in src) {
            if(typeof src[key] == 'object' && src[key] != null) {
                if(!isMatch(src[key],obj[key])) {
                    return false
                }
            } else {
                if(src[key] != obj[key]) {
                    return false
                }
            }
        }
        return true
    }

    function matches(src) {
        return function(obj) {
            return isMatch(obj,src)
        }
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

    function matchesProperty(path,value) {
        return function(obj) {
            return isEqual(get(obj,path),value)
        }
    }

    function property(path) {
        return function(obj) {
            return get(obj,path)
        }
    }

    function iteratee(func) {
        if(typeof func == 'string') {
            return property(func)
        }        
        if(Array.isArray(func)) {
            return matchesProperty(...func)
        }
        if(isFunction(func)) {
            return func
        }
        if(typeof func == 'object') {
            return matches(func)
        }
    }

    function isEqual(value,other) {
        if(value == other) {
            return true
        }
        if(isNaN(value) && isNaN(other)) {
            return true
        }
        if(typeof value == 'object' && typeof other == 'object') {
            let count1 = 0,count2 = 0
            for(let key in value) {
                count1++
            }
            for(let key in other) {
                count2++
            }
            if(count1 != count2) {
                return false
            }
            for(let key in value) {
                if(!isEqual(value[key],other[key])) {
                    return false
                }
            }
            return true    
        }
        return false
    }

    function isArray(value) {
        return Object.prototype.toString.call(value) == '[object Array]'
    }

    function isObject(value) {
        return value instanceof(Object)
    }

    function isFunction(value) {
        return Object.prototype.toString.call(value) == '[object Function]'
    }

    function isNaN(value) {
        return Number.isNaN(value)
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

    function drop(ary,n = 1) {
        return ary.slice(n)
    }

    function dropRight(ary,n = 1) {
        if(n < ary.length) {
            return ary.slice(0,ary.length - n)
        } else {
            return []
        }
    }

    function dropRightWhile(ary,predicate) {
        let result = ary.slice()
        if(!isFunction(predicate)) {
            predicate = iteratee(predicate)
        }
        for(let i = ary.length - 1;i >= 0;i--) {
            if(predicate(ary[i])) {
                result.pop()
            } else {
                break
            }
        }
        return result
    }

    function dropWhile(ary,predicate) {
        let t
        if(!isFunction(predicate)) {
            predicate = iteratee(predicate)
        }
        for(let i = 0;i < ary.length;i++) {
            if(!predicate(ary[i])) {
                t = i
                break
            }
        }
        return ary.slice(t)
    }
    
    function fill(ary,value,start = 0,end = ary.length) {
        for(let i = start;i < end;i++) {
            ary[i] = value
        }
        return ary
    }

    function findIndex(ary,predicate) {
        predicate = iteratee(predicate)
        for(let i = 0;i < ary.length;i++) {
            if(predicate(ary[i])) {
                return i
            }
        }
        return -1
    }

    function findLastIndex(ary,predicate) {
        predicate = iteratee(predicate)
        for(let i = ary.length - 1;i >= 0;i--) {
            if(predicate(ary[i])) {
                return i
            }
        }
        return -1
    }

    function fromPairs(pairs) {
        let map = {}
        pairs.forEach(element => {
            map[element[0]] = element[1]
        })
        return map
    }

    function head(ary) {
        return ary[0]
    }

    function indexOf(ary,value,fromIndex = 0) {
        for(let i = fromIndex;i < ary.length;i++) {
            if(!value && !ary[i]) {
                return i
            }
            if(ary[i] == value) {
                return i
            }
        }
        return -1
    }

    function initial(ary) {
        ary.pop()
        return ary
    }

    function intersection(arrays) {
        let ary = arguments[0]
        let nextArrays = []
        for(let i = 1;i < arguments.length;i++) {
            nextArrays[i - 1] = arguments[i]
        }
        let result = ary.filter(element => {
            return nextArrays.reduce((flag,nextAry) => {
                return indexOf(nextAry,element) >= 0 && flag
            },true)
        })
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
        isMatch,
        matches,
        matchesProperty,
        toPath,
        get,
        property,
        iteratee,
        isEqual,
        isArray,
        isObject,
        isFunction,
        isNaN,
        differenceBy,
        drop,
        dropRight,
        dropRightWhile,
        dropWhile,
        fill,
        findIndex,
        findLastIndex,
        fromPairs,
        head,
        indexOf,
        initial,
        intersection,
    }
}()