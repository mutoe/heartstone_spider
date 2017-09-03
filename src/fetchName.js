const cardDao = require('../dao/cardDao')

for (var i = 0; i < 26; i++) {
  cardDao.updateData(i)
}
