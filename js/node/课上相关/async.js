function resolveValue(val) {
	return new Promise(resolve => {
		setTimeout(() => resolve(val),  1000 + Math.random() * 2000)
	})
}

async function f() {
	console.log(1)
	var a = await resolveValue(5)
	console.log(a)
	var a = await resolveValue(5)
	console.log(a)
	var a = await resolveValue(5)
	console.log(a)
}
//协程   纤程   coroutine
async function g(){
	console.log(3)
	var b = await resolveValue(6)
    console.log(b)
	var b = await resolveValue(6)
    console.log(b)
	var b = await resolveValue(6)
    console.log(b)
}

f()
g()

console.log(2)