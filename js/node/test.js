import { resolveNaptr } from "dns"

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
// }

// var iter = foo()
// start()

// function start() {
//     iter.next().value.then(val => {
//         iter.next(val).value.then(val => {
//             var generate1 = iter.next(val)
//             console.log(generate1.done)
//             generate1.value.then(val => {
//                 var generate2 = iter.next(val)
//                 console.log(generate2.done)
//             })
//         })
//     })
// }

// function start(val) {
//     var generated = iter.next(val)
//     if(!generated.done) {
//         generated.value.then(val => {
//             start(val)
//         })
//     }
// }



function * foo() {
    var x = yield squareAsync(2)
    console.log(x)
    try {
        var y = yield squareAsync(3)
        console.log(y)
    } catch(e) {
        console.log('error',e)
    } 
    var z = yield squareAsync(4)
    console.log(z) 
}

var iter = foo()
var generated = iter.next()
step()

function step() {
    if(!generated.done) {
        generated.value.then(val => {
            generated = iter.next(val)
            step()
        },reason => {
            generated = iter.throw(reason)
            step()
        })
    }
}




Promise.resolve = function(val) {
    return new Promise(resolve => {
        resolve(val)
    })
}

Promise.all = function(promises) {
    return new Promise((resolve,reject) => {
        var result = []
        var count = 0
        for(let i = 0;i < promises.length;i++) {
            Promise.resolve(promises[i]).then(val => {
                count++
                result[i] = val
                if(count == promises.length) {
                    resolve(result)
                }
            },reason => {
                reject(reason)
            })
        }
    })
}

Promise.race = function(values) {
    return new Promise((resolve,reject) => {
        for(let i = 0;i < value.length;i++) {
            Promise.resolve(values[i]).then(val => {
                resolve(val)
            },reason => {
                reject(reason)
            })
        }
    })
}