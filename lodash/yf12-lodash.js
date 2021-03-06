var yf12 = (function() {
  function chunk(ary, size = 1) {
    if (size == 0) return [];
    var result = [];
    let l =
      ary.length / size === Math.floor(ary.length / size)
        ? ary.length / size
        : Math.floor(ary.length / size) + 1;
    let j = 0;
    for (let i = 0; i < l; i++) {
      var array = [],
        count = 0;
      while (count < size && ary[j]) {
        array.push(ary[j]);
        j++;
        count++;
      }
      result.push(array);
    }
    return result;
  }

  function compact(ary) {
    return ary.filter(it => it);
  }

  function slice(ary, start = 0, end = ary.length) {
    if (end > ary.length) end = ary.length;
    let result = [];
    for (let i = start; i < end; i++) {
      result.push(ary[i]);
    }
    return result;
  }

  function reduce(collection, combine, initialValue) {
    for (let i in collection) {
      if(initialValue === undefined) {
        initialValue = collection[i]
      } else {
        initialValue = combine(initialValue, collection[i], i, collection);
      }
    }
    return initialValue;
  }

  function reduceRight(collection, combine, initialValue) {
    let keys = Object.keys(collection).reverse()
    for (let key of keys) {
      if(initialValue === undefined) {
        initialValue = collection[key]
      } else {
        initialValue = combine(initialValue, collection[key], key, collection);
      }
    }
    return initialValue;
  }

  function negate(f) {
    return function(...args) {
      return !f(...args);
    };
  }

  function flatten(ary) {
    let result = [];
    for (let item of ary) {
      if (Array.isArray(item)) {
        result.push(...item);
      } else {
        result.push(item);
      }
    }
    return result;
  }

  function flattenDeep(ary) {
    let result = [];
    for (let item of ary) {
      if (Array.isArray(item)) {
        let flattedItem = flattenDeep(item);
        result.push(...flattedItem);
      } else {
        result.push(item);
      }
    }
    return result;
  }

  function flattenDepth(ary, depth = 1) {
    if (depth == 0) return ary.slice();
    let result = [];
    for (let item of ary) {
      if (Array.isArray(item)) {
        let flattedItem = flattenDepth(item, depth - 1);
        result.push(...flattedItem);
      } else {
        result.push(item);
      }
    }
    return result;
  }

  function curry(f, length = f.length) {
    return function(...args) {
      if (args.length >= length) {
        return f(...args);
      } else {
        return curry(f.bind(null, ...args), length - args.length);
      }
    };
  }

  function difference(ary, ...array) {
    let result = [];
    for (let i = 0; i < ary.length; i++) {
      let flag = false;
      for (let j = 0; j < array.length; j++) {
        if (array[j].indexOf(ary[i]) >= 0) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(ary[i]);
      }
    }
    return result;
  }

  function isMatch(obj, src) {
    if (obj == src) return true;
    for (let key in src) {
      if (typeof src[key] == "object" && src[key] != null) {
        if (!isMatch(src[key], obj[key])) {
          return false;
        }
      } else {
        if (src[key] != obj[key]) {
          return false;
        }
      }
    }
    return true;
  }

  function matches(src) {
    return function(obj) {
      return isMatch(obj, src);
    };
  }

  function toPath(str) {
    //a.b.0.c[fooo][bar].d
    return str.split(/\.|\[|\]./g);
  }

  function get(obj, path, defaultVal) {
    var path = toPath(path);
    for (var i = 0; i < path.length; i++) {
      if (obj == undefined) {
        return defaultVal;
      } else {
        obj = obj[path[i]];
      }
    }
    return obj;
  }

  function matchesProperty(path, value) {
    return function(obj) {
      return isEqual(get(obj, path), value);
    };
  }

  function property(path) {
    return function(obj) {
      return get(obj, path);
    };
  }

  function iteratee(func) {
    if (typeof func == "string") {
      return property(func);
    }
    if (Array.isArray(func)) {
      return matchesProperty(...func);
    }
    if (isFunction(func)) {
      return func;
    }
    if (typeof func == "object") {
      return matches(func);
    }
  }

  function isEqual(value, other) {
    if (value == other) {
      return true;
    }
    if (isNaN(value) && isNaN(other)) {
      return true;
    }
    if (typeof value == "object" && typeof other == "object") {
      let count1 = 0,
        count2 = 0;
      for (let key in value) {
        count1++;
      }
      for (let key in other) {
        count2++;
      }
      if (count1 != count2) {
        return false;
      }
      for (let key in value) {
        if (!isEqual(value[key], other[key])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function getTag(value) {
    return Object.prototype.toString.call(value);
  }

  function isArray(value) {
    return getTag(value) == "[object Array]";
  }

  function isObject(value) {
    return value instanceof Object;
  }

  function isFunction(value) {
    return getTag(value) === "[object Function]";
  }

  //new Number()构建的数字需要先转为原始数据类型
  function isNaN(value) {
    return isNumber(value) && +value !== +value;
  }

  function isBoolean(value) {
    return getTag(value) === "[object Boolean]";
  }

  function isDate(value) {
    return getTag(value) === "[object Date]";
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function isEmpty(value) {
    if (!value) return true;
    for (let key in value) {
      return false;
    }
    return true;
  }

  function isError(value) {
    return getTag(value) === "[object Error]";
  }

  function isFinite(value) {
    return Number.isFinite(value);
  }

  function isNil(value) {
    return value === null || value === undefined;
  }

  function isNull(value) {
    return value === null;
  }

  function isNumber(value) {
    return (
      getTag(value) === "[object Number]" || getTag(value) === "[object Null]"
    );
  }

  function isRegExp(value) {
    return getTag(value) === "[object RegExp]";
  }

  function isString(value) {
    return getTag(value) === "[object String]";
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isMap(value) {
    return value instanceof Map
  }

  function isArguments(value) {
    return getTag(value) === "[object Arguments]"
  }

  function differenceBy(ary, ...array) {
    let func = array.pop();
    if (typeof func == "object") {
      array.push(func);
      return difference(ary, ...array);
    }
    let result = [];
    if (typeof func == "string") {
      if (/\=\>/.exec(func)) {
        let prams = func.match(/(.+)\s\=\>/)[1];
        let returnval = func.match(/\=\>\s(.+)/)[1];
        func = new Function(prams, "return" + " " + returnval);
      } else {
        func = property(func);
      }
    }
    for (let i = 0; i < ary.length; i++) {
      let flag = true;
      for (let j = 0; j < array.length; j++) {
        let aryf = array[j].map(func);
        if (aryf.indexOf(func(ary[i])) >= 0) {
          flag = false;
          break;
        }
      }
      if (flag) {
        result.push(ary[i]);
      }
    }
    return result;
  }

  /**
   * [find description]
   *
   * @param   {[Array]}  array  [array description]
   * @param   {[...Array]}  values   [values description]
   * @param   {[Function]}  comparator   [comparator description]
   *
   * @return  {[Array]}              [return array]
   */
  function differenceWith(array, values, comparator) {
    comparator = iteratee(comparator);
    let result = [];
    for (let i = 0; i < array.length; i++) {
      if (!values.every(item => comparator(item, array[i]))) {
        result.push(array[i]);
      }
    }
    return result;
  }

  function drop(ary, n = 1) {
    return ary.slice(n);
  }

  function dropRight(ary, n = 1) {
    if (n < ary.length) {
      return ary.slice(0, ary.length - n);
    } else {
      return [];
    }
  }

  function dropRightWhile(ary, predicate) {
    let result = ary.slice();
    if (!isFunction(predicate)) {
      predicate = iteratee(predicate);
    }
    for (let i = ary.length - 1; i >= 0; i--) {
      if (predicate(ary[i])) {
        result.pop();
      } else {
        break;
      }
    }
    return result;
  }

  function dropWhile(ary, predicate) {
    let t;
    if (!isFunction(predicate)) {
      predicate = iteratee(predicate);
    }
    for (let i = 0; i < ary.length; i++) {
      if (!predicate(ary[i])) {
        t = i;
        break;
      }
    }
    return ary.slice(t);
  }

  function fill(ary, value, start = 0, end = ary.length) {
    for (let i = start; i < end; i++) {
      ary[i] = value;
    }
    return ary;
  }

  function findIndex(ary, predicate) {
    predicate = iteratee(predicate);
    for (let i = 0; i < ary.length; i++) {
      if (predicate(ary[i])) {
        return i;
      }
    }
    return -1;
  }

  function findLastIndex(ary, predicate) {
    predicate = iteratee(predicate);
    for (let i = ary.length - 1; i >= 0; i--) {
      if (predicate(ary[i])) {
        return i;
      }
    }
    return -1;
  }

  function fromPairs(pairs) {
    let map = {};
    pairs.forEach(element => {
      map[element[0]] = element[1];
    });
    return map;
  }

  function head(ary) {
    return ary[0];
  }

  function indexOf(ary, value, fromIndex = 0) {
    for (let i = fromIndex; i < ary.length; i++) {
      if (!value && !ary[i]) {
        return i;
      }
      if (ary[i] == value) {
        return i;
      }
    }
    return -1;
  }

  function initial(ary) {
    ary.pop();
    return ary;
  }

  function intersection(arrays) {
    let ary = arguments[0];
    let nextArrays = [];
    for (let i = 1; i < arguments.length; i++) {
      nextArrays[i - 1] = arguments[i];
    }
    let result = ary.filter(element => {
      return nextArrays.reduce((flag, nextAry) => {
        return indexOf(nextAry, element) >= 0 && flag;
      }, true);
    });
    return result;
  }

  function join(ary, seperator = ",") {
    let string = "";
    for (let i = 0; i < ary.length - 1; i++) {
      string += `${ary[i]}${seperator}`;
    }
    string += ary[ary.length - 1];
    return string;
  }

  function last(ary) {
    return ary[ary.length - 1];
  }

  function lastIndexOf(ary, value, fromIndex = ary.length - 1) {
    for (let i = fromIndex; i >= 0; i--) {
      if (!value && !ary[i]) {
        return i;
      }
      if (ary[i] == value) {
        return i;
      }
    }
    return -1;
  }

  function pull(ary, ...values) {
    for (let i = ary.length - 1; i >= 0; i--) {
      if (indexOf(values, ary[i]) >= 0) {
        ary = ary.slice(0, i).concat(ary.slice(i + 1));
      }
    }
    return ary;
  }

  function reverse(ary) {
    let result = [];
    for (let i = ary.length - 1; i >= 0; i--) {
      result.push(ary[i]);
    }
    ary = result;
    return ary;
  }

  function sortedIndex(ary, value) {
    let left = 0,
      right = ary.length - 1;
    while (left < right) {
      let mid = left + Math.floor((right - left) / 2);
      if (ary[mid] >= value) {
        right = mid;
      } else if (ary[mid] < value) {
        left = mid + 1;
      }
    }
    return left;
  }

  function union(arrays) {
    let result = [];
    for (let i = 0; i < arguments.length; i++) {
      arguments[i].forEach(item => {
        if (indexOf(result, item) < 0) {
          result.push(item);
        }
      });
    }
    return result;
  }

  function unionBy(...params) {
    let result = [];
    let predicate = iteratee(params[params.length - 1]);
    for (let i = 0; i < params.length - 1; i++) {
      params[i].forEach(item => {
        let aryresult = result.map(predicate);
        if (indexOf(aryresult, predicate(item)) < 0) {
          result.push(item);
        }
      });
    }
    return result;
  }

  function uniq(ary) {
    let result = [];
    ary.forEach(item => {
      if (indexOf(result, item) < 0) {
        result.push(item);
      }
    });
    return result;
  }

  function uniqBy(ary, predicate) {
    predicate = iteratee(predicate);
    let result = [];
    ary.forEach(item => {
      let aryresult = result.map(predicate);
      if (indexOf(aryresult, predicate(item)) < 0) {
        result.push(item);
      }
    });
    return result;
  }

  function zip(...arrays) {
    let result = [];
    let maxLength = Math.max(...arrays.map(item => item.length));
    for (let i = 0; i < maxLength; i++) {
      let ary = [];
      for (let j = 0; j < arrays.length; j++) {
        ary[j] = arrays[j][i];
      }
      result.push(ary);
    }
    return result;
  }

  function unzip(array) {
    let result = [];
    for (let i = 0; i < array[0].length; i++) {
      let ary = [];
      for (let j = 0; j < array.length; j++) {
        ary[j] = array[j][i];
      }
      result.push(ary);
    }
    return result;
  }

  function without(ary, ...values) {
    let result = [];
    ary.forEach(item => {
      if (indexOf(values, item) < 0) {
        result.push(item);
      }
    });
    return result;
  }

  function xor(...arrays) {
    let result = [],
      compare = [];
    for (let i = 0; i < arrays.length; i++) {
      for (let j = 0; j < arrays[i].length; j++) {
        for (let m = i + 1; m < arrays.length; m++) {
          for (let n = 0; n < arrays[m].length; n++) {
            if (arrays[i][j] == arrays[m][n]) {
              compare.push(arrays[i][j]);
            }
          }
        }
        if (indexOf(compare, arrays[i][j]) < 0) {
          result.push(arrays[i][j]);
        }
      }
    }
    return result;
  }

  /**
   * [countBy description]
   *
   * @param   {[Array|Object]}  collection
   * @param   {[Object]}  predicate
   *
   * @return  {[Object]}
   */
  function countBy(collection, predicate) {
    let map = {};
    predicate = iteratee(predicate);
    for (let item of collection) {
      if (predicate(item) in map) {
        map[predicate(item)]++;
      } else {
        map[predicate(item)] = 1;
      }
    }
    return map;
  }

  /**
   * [every description]
   *
   * @param   {[Array|Object]}  collection
   * @param   {[Object]}  predicate
   *
   * @return  {[boolean]}
   */
  function every(collection, predicate) {
    predicate = iteratee(predicate);
    let judge = true;
    for (let item of collection) {
      judge = predicate(item) && judge;
    }
    return judge;
  }

  /**
   * [filter description]
   *
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[]}  predicate   [predicate description]
   *
   * @return  {[Array]}              [return description]
   */
  function filter(collection, predicate) {
    predicate = iteratee(predicate);
    return collection.filter(predicate);
  }

  /**
   * [find description]
   *
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[type]}  predicate   [predicate description]
   * @param   {[number]}  fromIndex   [fromIndex description]
   *
   * @return  {[type]}              [return description]
   */
  function find(collection, predicate, fromIndex = 0) {
    predicate = iteratee(predicate);
    for (let i = fromIndex; i < collection.length; i++) {
      if (predicate(collection[i])) {
        return collection[i];
      }
    }
    return undefined;
  }

  /**
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[Function]}  [iteratee=_.identity]
   * @return  {[Array]}              [return description]
   */
  function flatMap(collection, predicate) {
    predicate = iteratee(predicate);
    let keys = Object.keys(collection);
    if (predicate) collection = keys.map(key => predicate(collection[key]));
    return flatten(collection);
  }

  /**
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[Function]}  [iteratee=_.identity]
   * @return  {[Array]}              [return description]
   */
  function flatMapDeep(collection, predicate) {
    predicate = iteratee(predicate);
    let keys = Object.keys(collection);
    if (predicate) collection = keys.map(key => predicate(collection[key]));
    return flattenDeep(collection);
  }

  /**
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[Function]}  [iteratee=_.identity]
   * @return  {[Array]}              [return description]
   */
  function flatMapDepth(collection, predicate, depth = 1) {
    predicate = iteratee(predicate);
    let keys = Object.keys(collection);
    if (predicate) collection = keys.map(key => predicate(collection[key]));
    return flattenDepth(collection, depth);
  }

  /**
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[Function]}  [iteratee=_.identity]
   * @return  {[*]}         [Returns collection]
   */
  function forEach(collection, predicate) {
    predicate = iteratee(predicate);
    let keys = Object.keys(collection);
    for (key of keys) {
      predicate(collection[key], key, collection);
    }
    return collection;
  }

  /**
   * @param   {[Array|Object]}  collection  [collection description]
   * @param   {[Function]}  [iteratee=_.identity]
   * @return  {[*]}         [Returns collection]
   */
  function forEachRight(collection, predicate) {
    predicate = iteratee(predicate);
    let keys = Object.keys(collection);
    keys = reverse(keys);
    for (key of keys) {
      predicate(collection[key], key, collection);
    }
    return collection;
  }

  /**
   * 
   * @param {*} value
   * @return {*}   Returns the deep cloned value.
   */
  function cloneDeep(value) {
    let result
    if(isObject(value)) {
      if(isRegExp(value)) result = new RegExp(value.source, value.flags)
      else if(isArray(value)) {
        result = []
      } else {
        result = {}
      }
      for(let key in value) {
        if(!isObject(value[key])) {
          result[key] = value[key]
        } else {
          result[key] = cloneDeep(value[key])
        }
      }
    } else {
      result = value
    }
    return result
  }

  function identity(...args) {
    return args[0]
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {Function} predicate
   * @return {Function}
   */
  function groupBy(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let ary = Object.values(collection)
    let result = {}
    ary.forEach(value => {
      if(predicate(value) in result) {
        result[predicate(value)].push(value)
      } else {
        result[predicate(value)] = [value]
      }
    })
    return result
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {*} predicate
   * @return {Array}
   */
  function map(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let result = []
    for(let [key, value] of Object.entries(collection)) {
      if(!isNaN(key)) key = Number(key)
      result.push(predicate(value, key, collection))
    }
    return result
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {Function} predicate
   * @return {Array}
   */
  function partition(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let result1 = [], result2 = []
    collection.map(value => {
      if(predicate(value)) result1.push(value)
      else result2.push(value)
    })
    return [result1, result2]
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {Function} predicate
   * @return {Array}
   */
  function reject(collection, predicate = identity) {
    predicate = iteratee(predicate)
    let ary = Object.values(collection)
    let result = []
    ary.forEach(value => {
      if(!predicate(value)) {
        result.push(value)
      }
    })
    return result
  }

  /**
   * 
   * @param {[Array|Object]} collection
   * @return {*}
   */
  function sample(collection) {
    let values = Object.values(collection)
    let index = Math.floor(Math.random() * values.length)
    return values[index]
  }
 
  /**
   * 
   * @param {[Array|Object]} collection
   * @param {Number} [n=1]
   * @return {*}
   */
  function sampleSize(collection, n) {
    let values = Object.values(collection)
    let result = []
    let size = n <= values.length ? n : values.length
    for(let i = 0; i < size; i++) {
      let index = Math.floor(Math.random() * values.length)
      result.push(values[index])
      values.splice(index, 1)
    }
    return result
  }

  function shuffle(collection) {
    let values = Object.values(collection)
    return sampleSize(values, values.length)
  }

  function size(collection) {
    return Object.values(collection).length
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {Function} predicate
   * @return {boolean}
   */
  function some(collection, predicate = identity) {
    predicate = iteratee(predicate)
    for(let [key, value] of Object.entries(collection)) {
      if(predicate(value)) {
        return true
      }
    }
    return false
  }

  /**
   * 
   * @param {[Array|Object]} collection 
   * @param {Function} predicate
   * @return {Array}
   */
  function sortBy(collection, predicate = [identity]) {
    predicate = map(predicate, iteratee)
    let values = Object.values(collection)
    let compare = (a, b) => {
      for(let i = 0; i < predicate.length; i++) {
        if (predicate[i](a) < predicate[i](b)) return -1
        else if (predicate[i](a) > predicate[i](b)) return 1
      }
      return 0
    }
    return quickSort(values, compare)
    // return values.sort((a, b) => compare(a, b, predicate))
  }

  function quickSort(ary, compare, start = 0, end = ary.length - 1) {
    if(end - start <= 0) return ary
    let pivotIndex = Math.floor(Math.random() * (end - start + 1)) + start
    let pivot = ary[pivotIndex]
    swap(ary, pivotIndex, end)
    let i = start - 1
    for(let j = start; j < end; j++) {
      if(compare(ary[j], pivot) < 0) {
        i++
        swap(ary, i, j)
      }
    }
    i++
    swap(ary, i, end)
  
    quickSort(ary, compare, start, i - 1)
    quickSort(ary, compare, i + 1, end)
  
    return ary
  
  
    function swap(ary, i, j) {
      let t = ary[i]
      ary[i] = ary[j]
      ary[j] = t
      return ary
    }
  }

  function defer(func, ...args) {
    return setTimeout(() => {
      func(...args)
    }, 1)
  }

  function delay(func, wait, ...args) {
    return setTimeout(() => {
      func(...args)
    }, wait)
  }

  function toArray(value) {
    try {
      let ary = Object.values(value)
      return ary
    } catch(error) {
      return []
    }
  }

  function max(array) {
    if(array.length === 0) return undefined
    let maxValue = -Infinity
    array.forEach(item => {
      if(item > maxValue) {
        maxValue = item
      }
    })
    return maxValue
  }

  function maxBy(array, predicate = identity) {
    predicate = iteratee(predicate)
    if(array.length === 0) return undefined
    let maxItem = array[0]
    array.forEach(item => {
      if(predicate(item) > predicate(maxItem)) {
        maxItem = item
      }
    })
    return maxItem    
  }

  function min(array) {
    if(array.length === 0) return undefined
    let minValue = Infinity
    array.forEach(item => {
      if(item < minValue) {
        minValue = item
      }
    })
    return minValue    
  }

  function minBy(array, predicate = identity) {
    predicate = iteratee(predicate)
    if(array.length === 0) return undefined
    let minItem = array[0]
    array.forEach(item => {
      if(predicate(item) < predicate(minItem)) {
        minItem = item
      }
    })
    return minItem    
  }

  function sumBy(array, predicate = identity) {
    predicate = iteratee(predicate)
    let sum = 0
    array.forEach(item => {
      item = predicate(item)
      sum += item
    })
    return sum
  }

  /**
   * 向上取整
   * @param {*} number 
   * @param {*} precision 
   */
  function ceil(number, precision = 0) {
    return Math.ceil(number * 10 ** precision) / 10 ** precision
  }

  /**
   * 四舍五入
   * @param {*} number 
   * @param {*} precision 
   */
  function round(number, precision = 0) {
    return Math.round(number * 10 ** precision) / 10 ** precision
  }

  function random(lower = 0, upper = 1, floating) {
    if(arguments.length === 0) {
      floating = false
    } else if(arguments.length === 1) {
      if(!isBoolean(arguments[0])) {
        lower = 0
        upper = arguments[0]
        floating = false
      } else {
        lower = 0
        floating = arguments[0]
      }
    } else if(arguments.length === 2) {
      if(isBoolean(arguments[1])) {
        lower = 0
        upper = arguments[0]
        floating = arguments[1]        
      } else {
        floating = false
      }
    } 

    if(lower > upper) {
      let t = lower
      lower = upper
      upper = t
    }

    if(!floating) {
      return Math.floor(Math.random() * (upper - lower + 1)) + lower
    } else {
      return Math.random() * (upper - lower) + lower
    }
  }

  function assign(object, ...source) {
    for(let i = 0; i < source.length; i++) {
      for(let key in source[i]) {
        if(!(key in source[i].__proto__)) {
          object[key] = source[i][key]
        }
      }
    }
    return object
  }

  function assignIn(object, ...source) {
    for(let i = 0; i < source.length; i++) {
      for(let key in source[i]) {
        object[key] = source[i][key]
      }
    }
    return object
  }

  return {
    chunk,
    compact,
    slice,
    reduce,
    reduceRight,
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
    getTag,
    isEqual,
    isArray,
    isObject,
    isFunction,
    isNaN,
    isBoolean,
    isDate,
    isElement,
    isEmpty,
    isError,
    isFinite,
    isNil,
    isNull,
    isNumber,
    isRegExp,
    isString,
    isUndefined,
    isMap,
    isArguments,
    differenceBy,
    differenceWith,
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
    join,
    last,
    lastIndexOf,
    pull,
    reverse,
    sortedIndex,
    union,
    unionBy,
    uniq,
    uniqBy,
    zip,
    unzip,
    without,
    xor,
    countBy,
    every,
    filter,
    find,
    flatMap,
    flatMapDeep,
    flatMapDepth,
    forEach,
    forEachRight,
    cloneDeep,
    identity,
    groupBy,
    map,
    partition,
    reject,
    sample,
    sampleSize,
    shuffle,
    size,
    some,
    sortBy,
    defer,
    delay,
    toArray,
    max,
    maxBy,
    min,
    minBy,
    ceil,
    round,
    sumBy,
    random,
    assign,
    assignIn,
  };
})();
