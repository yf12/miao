var xhr = new XMLHttpRequest()
xhr.open("GET","http://xieranmaya.github.io/images/cats/cats.json")
xhr.send()

var imgs = JSON.parse(xhr.responseText)

imgs.forEach(element => {
    element.url = "http://xieranmaya.github.io/images/cats/" + element.url
});