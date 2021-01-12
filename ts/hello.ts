function sayHello(person: string) {
  return 'Hello' + person
}

let user = 'Tom'
console.log(sayHello(user))

let ary: any[] = ['a', 'b', 'c']

let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y
}

interface Animal {
  name: string;
}
interface Cat {
  name: string;
  run(): void;
}

let tom: Cat = {
  name: 'Tom',
  run: () => { console.log('run') }
};
let animal: Animal = tom;
