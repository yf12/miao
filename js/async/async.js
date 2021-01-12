function asyncMap(ary,asyncMapper,callback) {
    var result = []
    var count = 0
    for(let i = 0;i < ary.length;i++) {
        asyncMapper(ary[i],(err,item) => {
            count++
            result[i] = item
            if(count == ary.length) {
                callback(err,result)
            }
        })
    }
}

asyncMap([1,2,3,4,5],(val,callback) => {
	setTimeout(() => {
        callback(null,val * val)
    },Math.random() * 3000)
},(err,result) => console.log(result))

async.map([1,2,3,4,5],(val,callback) => {
	setTimeout(() => {
        callback(null,val * val)
    },Math.random() * 3000)
},(err,result) => console.log(result))


function asyncFilter(ary,filterFunc,done) {
    var result = []
    var count = 0
    for(let i = 0;i < ary.length;i++) {
        filterFunc(ary[i],(retain) => {
            count++
            if(retain == true) {
                result[i] = ary[i]
            } else {
                result[i] = false
            }
            if(count == ary.length) {
                var realResult = result.filter(item => item)
                done(realResult)
            }
        })
    }
}

function asyncFilter(ary,filterFunc,done) {
    var result = []
    var count = 0
    for(let i = 0;i < ary.length;i++) {
        filterFunc(ary[i],isRetain => {  //isRetain表示ary[i]是否保留
            count++
            if(isRetain) {
                result[i] = ary[i]
            }
            if(count == ary.length) {   //result may be: [,1,,3,,,5]
                var realResult = []
                for(var idx in result) {
                    realResult.push(result[idx])
                }
                done(realResult)
            }
        })
    }
}

asyncFilter([1,2,3,4,5],(val,callback) => {
	setTimeout(() => {
        if(val % 2 == 0) {
            callback(true)
        } else {
            callback(false)
        }	
    },Math.random() * 3000)
},(result) => console.log(result))

async.filter([1,2,3,4,5],(val,callback) => {
	setTimeout(() => {
        if(val % 2 == 0) {
            callback(null,true)
        } else {
            callback(null,false)
        }	
    },Math.random() * 3000)
},(err,result) => console.log(result))


function asyncEvery(ary,test,callback) {
    var count = 0
    var flag = false
    for(let i = 0;i < ary.length;i++) {
        test(ary[i],(isPass) => {
            if(isPass) {
                count++
                if(count == ary.length) {
                    callback(true)
                }
            } else {
                if(!flag) {
                    flag = true
                    callback(false)
                }
            }
        })
    }
}

function asyncSome(ary,test,callback) {
    var count = 0
    var flag = false
    for(let i = 0;i < ary.length;i++) {
        test(ary[i],(isPass) => {
            if(!isPass) {
                count++
                if(count == ary.length) {
                    callback(false)
                }
            } else {
                if(!flag) {
                    flag = true
                    callback(true)
                }
            }
        })
    }
}
