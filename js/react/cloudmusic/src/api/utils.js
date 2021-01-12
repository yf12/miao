export const getCount = count => {
  if (count < 0) return
  if (count < 10000) {
    return count
  } else if (Math.floor(count / 10000) < 10000) {
    return Math.floor(count / 1000) / 10 + '万'
  } else {
    return Math.floor(count / 10000000) / 10 + '亿'
  }
}

//防抖函数
export const debounce = (func, delay) => {
  let timer
  return function (...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, delay)
  }
}

//找到第一个没有歌名的排行榜的索引
export const filterIndex = rankList => {
  for(let i = 0; i < rankList.length - 1; i++) {
    if(rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1
    }
  }
}

//处理歌手列表拼接歌手名字
export const getName = list => {
  let str = ""
  list.map((item, index) => {
    str += index === 0 ? item.name : '/' + item.name
    return item
  })
  return str
}

//判断一个对象是否为空
export const isEmptyObject = obj => !obj || Object.keys(obj).length === 0

// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement('div').style

let vendor = (() => {
  //首先通过transition属性判断是什么浏览器
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTranform',
    standard: 'Transform'
  }
  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if(vendor === false) {
    return false
  }
  if(vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

export const formatPlayTime = interval => {
  interval = interval | 0
  const minute = (interval / 60) | 0
  const second = (interval % 60).toString().padStart(2, "0")
  return `${minute}:${second}`
}

//找到当前歌曲的索引
export const findIndex = (song, list) => {
  return list.findIndex(item => {
    return song.id === item.id
  })
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//随机算法
export const shuffle = arr => {
  let newArr = Array.from(arr)
  for(let i = 0; i < arr; i++) {
    let j = getRandomInt(0, i)
    let t = newArr(i)
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  return newArr
}
