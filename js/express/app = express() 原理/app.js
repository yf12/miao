var fns = [next => {
    console.log(1)
    setTimeout(next,1000)
},next => {
    console.log(2)
    setTimeout(next,1000)
},next => {
    console.log(3)
    setTimeout(next,1000)
},next => {
    console.log(4)
    setTimeout(next,1000)
}]

var composed = fns.reduceRight((previousNext,f) => {
	return function next() {
		f(previousNext)
    }
},() => {})

composed()





//接参数时

function compose(fns) {
    return fns.reduceRight((prev,f) => {
        return function (req,res) {
            f(req, res, () => {
                prev(req, res)
            })
        }
    },() => {})
}

function compose(mws) {
    return mws.reduceRight((prev,mw) => {
        return function (req,res) {
            mw(req, res, function next() {
                prev(req, res)
            })
        }
    },function next() {})
}