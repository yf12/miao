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
                let flattedItem = yf12.flattenDeep(item)
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
                let flattedItem = yf12.flattenDepth(item,depth - 1)
                result.push(...flattedItem)
            } else {
                result.push(item)
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
    }
}()