const async = require('async')
const fs = require('fs')
const request = require('request')

let urls = []
let start = 1
let len = 2000

const savepath = '../download/'
const imgUrl = 'http://www.heartharena.com/images/cards/'
const imgExt = '.png'

let connCount = 0
let errorCount = 0


for(let i = start; i <= len; i++) {
  urls.push(i)
}

const startTime = new Date().getTime()

async.mapLimit(urls, 10, (id, callback) => {
  fetchImg(id, callback)
}, (err, result) => {
  if (err) console.error(err)
  else {
    const endTime = new Date().getTime()
    const spent = (endTime - startTime) / 1000

    console.log('Done. Consuming ' + spent + 's total.')
  }
})

function fetchImg(id, callback) {
  let cur = id + '/' + len
  let url = imgUrl + id + imgExt
  let filepath = savepath + id + imgExt
  fs.exists(filepath, exists => {
    if (exists) {
      console.log(cur + ': passed. because of file was exists')
      callback(null, 'exists')
    } else {
      connCount++

      request.head(url, (err, res, body) => {
        if (err) {
          console.error(err)
          callback(null, err)
          return
        }
        if (res.statusCode == '404') {
          console.error(cur + ': passed. because of 404')
          errorCount++
          callback(null, '404')
          return
        }
        console.log(res.statusCode)
        request(url)
          .pipe(fs.createWriteStream(filepath))
          .on('close', () => {
            console.log(cur + ': done.')
            connCount--
            callback(null, url)
          })

      })
    }
  })
}
