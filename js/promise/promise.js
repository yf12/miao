import { resolveNaptr } from "dns"

var promise = new Promise(function(resolve,reject) {
    get(url,function(err,data) {
        if(err) {
            reject(err)
        } else {
            resolve(data)
        }
    })
})

function getImg(url) {
    return new Promise((resolve,reject) => {
        var img = new Image()
        img.onload = function() {
            resolve(img)
        }
        img.onerror = function() {
            reject(e)
        }
        img.src = url
    })
}


Promise.resolve = function(val) {
    return new Promise(resolve => {
        resolve(val)
    })
}

Promise.reject = function(val) {
    return new Promise((resolve,reject) => {
        reject(val)
    })
}

Promise.prototype.catch = function(onRejected) {
    return this.then(null,onRejected)
}

Promise.all = function(promises) {
    return new Promise((resolve,reject) => {
        var result = []
        var count = 0
        if(promises.length == 0) {
            resolve([])
            return
        }
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
        for(let i = 0;i < values.length;i++) {
            Promise.resolve(values[i]).then(val => {
                resolve(val)
            },reason => {
                reject(reason)
            })
        }
    })
}

Promise.race = function(values) {
    return new Promise((resolve,reject) => {
        for(let i = 0;i < values.length;i++) {
            Promise.resolve(values[i]).then(resolve,reject)  //这个两个函数可以随意调，但只有第一次有实际效果
        }
    })
}


try {
    var story = getJSON('story.json')
    var chapter1 = getJSON(story.chapterUrls[0])
    addHtmlToPage(chapter1.html)
} catch(e) {
    addTextToPage("Failed to show chapter")
}
document.querySelector('.spinner').style.display = 'none'

getJSON('story.json').then(function(story) {
    return getJSON(story.chapterUrls[0])
}).then(function(chapter1) {
    addHtmlToPage(chapter1.html)
}).catch(function() {
    addTextToPage("Failed to show chapter")
}).then(function() {
    document.querySelector('.spinner').style.display = 'none'
})


var story
var storyPromise = getJSON('story.json').then(value => {
    story = value
})

for(;;) {
    storyPromise = storyPromise.then(() => {
        return getChapter(story.chapterUrls[i++])
    })
    .then(chapter => {
        addHtmlToPage(chapter.html)
    })
}


function ResolvePromise(promise,x,resolve,reject) {
    if(x == promise) {
        reject(new TypeError())
        return
    }

    if(x instanceof Mypromise) {
        return x.then(resolve,reject)
    }

    if(x && typeof x == 'object' || typeof x == 'function') {
        let then
        try {
            then = x.then  //x.then是getter时可能会有问题
        } catch(e) {
            reject(e)
            return
        }

        if(typeof then == 'function') {
            let called = false
            try {
                then.call(x,function resolvePromise(y) {
                    if(!called) {
                        called = true
                        ResolvePromise(promise,y,resolve,reject)
                    }
                },function rejectPromise(r) {
                    if(!called) {
                        called = true
                        reject(r)
                    }
                })
            } catch(e) {
                if(!called) {
                    reject(e)
                } 
            }
        } else {
            resolve(x)
        }
    } else {
        resolve(x)
    }
}