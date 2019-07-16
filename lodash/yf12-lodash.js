var yf12 = {   
    chunk: function(ary,size = 1) {
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
    },

    compact: function(ary) {
        return ary.filter(it => it)
    },
}