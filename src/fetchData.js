const superagent = require('superagent')

const cardDao = require('../dao/cardDao')

const post_url = 'http://cha.17173.com/hs/list/async?_n='
const post_header = {
  'Origin': 'http://cha.17173.com',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 L, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Referer': 'http://cha.17173.com/hs/',
  'X-Requested-With': 'XMLHttpRequest',
  'Connection': 'keep-alive',
}

let now = new Date().getTime()

let fetchData = data => {
  superagent
    .post(post_url + now)
    .set(post_header)
    .send(data)
    .end((err, res) => {
      if (err) {
        console.error(err)
        return
      }
      let res_data = JSON.parse(res.text).data
      const len = res_data.length
      for (let [index, item] of res_data.entries()) {
        let cur = (index + 1) + '/' + len
        cardDao.insert(item, err => {
          if (err) {
            console.log(cur + '\t error: ' + err)
            return
          }
          console.log(cur + '\t done')
        })
      }
    })
}

for (var j = 0; j < 25; j++) {
  for (var i = 1; i <= 100; i++) {
    fetchData({cost: j, page: i})
  }
}
