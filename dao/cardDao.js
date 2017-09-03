const mysql = require('mysql')

const $conf = require('../config/db')
const $sql = require('../dao/sqlMap')

const pool = mysql.createPool($conf.mysql)

let count = 0

const insert = (data, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err)
      return
    }
    const sql_data = [data.card_id, data.name, data.id, data.addtime, data.edittime, data.card_set, data.card_type, data.class, data.rarity, data.cost, data.atk, data.health, data.race, data.decomposition, data.synthesis, data.taunt, data.freeze, data.windfury, data.battlecry, data.stealth, data.combo, data.aura, data.charge, data.grant_charge, data.spellpower, data.silence, data.enrage, data.divine_shield, data.deathrattle, data.secret, data.inspire, data.mission]

    conn.query($sql.insert, sql_data, (err, result) => {
      conn.release()
      if (err) {
        callback(err.sqlMessage)
        return
      }
      callback(null, result)
    })
  })
}

// fetchName 同步卡牌名称
const updateData = (data, callback) => {
  let cost = data
  pool.getConnection((err, conn) => {
    if (err) {
      console.error(err)
      return
    }
    let arr
    conn.query($sql.fetchNewList, [cost], (err, result) => {
      if (err) {
        callback(err.sqlMessage)
        return
      }
      arr = result

      for (let item of arr) {

        conn.query($sql.fetchOldOne, [item.name_cn], (err, result) => {
          if (err) {
            console.error(err)
            return
          }
          if (!result[0]) {
            return
          }
          let name_en = result[0].res
          name_en = name_en.replace(/\+|0/g, ' ')       // 特殊字符转化为空格
          name_en = name_en.replace(/([A-Z])/g, ' $1')  // 单词分割
          name_en = name_en.replace(/ +/g, ' ')         // 过滤多个空格
          name_en = name_en.trim()                      // 过滤首尾空格

          conn.query($sql.updateOne, [name_en, item.name_cn], (err, result) => {
            if (err) {
              console.error(err)
              return
            }
            count++
            console.log(count + '\t' + item.name_cn + ' ' + name_en)
          })
        })
      }
    })
    conn.release()
  })
}

module.exports = {
  insert,
  updateData,
}
