import { promises } from "fs"

function squareAsync(x) {
    return new Promise(resolve => {
        setTimeout(() => resolve(x * x),1000 + Math.random() * 2000)
    })
}

// function * foo() {
//     var x = yield squareAsync(2)
//     console.log(x)
//     var y = yield squareAsync(3)
//     console.log(y)
//     var z = yield squareAsync(4)
//     console.log(z)
//     var z = yield squareAsync(4)
//     console.log(z)
//     var z = yield squareAsync(4)
//     console.log(z)
//     var z = yield squareAsync(4)
//     console.log(z)
// }

// var iter = foo()
// start()

// function start(val) {
//     var generated = iter.next(val)
//     if(!generated.done) {
//         generated.value.then(paraVal => {
//             start(paraVal)
//         })
//     }
// }



function * foo() {
    var x = yield squareAsync(2)
    console.log(x)
    try {
        var y = yield Promise.reject(3)
        console.log(y)
    } catch(e) {
        console.log('error',e)
    }
    var z = yield squareAsync(4)
    console.log(z)
    var z = yield squareAsync(4)
    console.log(z)
    var z = yield squareAsync(4)
    console.log(z)
    var z = yield squareAsync(4)
    console.log(z)
}

var iter = foo()
var generated = iter.next()
step()

function step() {
    if(!generated.done) {
        generated.value.then(paraVal => {
            generated = iter.next(paraVal)
            step()
        },reason => {
            generated = iter.throw(reason)
            step()
        })
    }
}



run(function * foo() {
    var x = yield squareAsync(2)
    console.log(x)
    try { 
        var y = yield Promise.reject(3)   //yield语义是生成，其实是在等待promise的结果
        console.log(y)
    } catch(e) {
        console.log('error',e)
    }
    var z = yield squareAsync(4)
    console.log(z)
    return squareAsync(6)
})
.then((val) => {
    console.log(val)
})

function run(generatorFunction) {
    return new Promise((resolve,reject) => {
        var iter = generatorFunction()
        var generated
        try {
            generated = iter.next()
            step()
        } catch(e) {
            reject(e)
        }
        
        function step() {
            if(!generated.done) {
                generated.value.then(paraVal => {
                    try {
                        generated = iter.next(paraVal)
                        step()
                    } catch(e) {
                        reject(e)
                    }
                },reason => {
                    try {
                        generated = iter.throw(reason)
                        step()
                    } catch(e) {
                        reject(e)
                    } 
                })
            } else {
                Promise.resolve(generated.value).then(resolve,reject)
            }
        }
    })
}

