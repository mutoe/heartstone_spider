module.exports = {
  insert: `
    insert into card(card_id, name_cn, id_17173, add_time, edit_time, card_set, card_type, class, rarity, cost, atk, health, race, decomposition, synthesis, taunt, freeze, windfury, battlecry, stealth, combo, aura, charge, grant_charge, spellpower, silence, enrage, divine_shield, deathrattle, secret, inspire, mission)
    value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  fetchNewList: `
    select * from card
    where cost = ?
  `,

  fetchOldOne: `
    select * from old_card
    where name = ?
    limit 1
  `,

  updateOne: `
    update card
    set name = ?
    where name_cn = ?
  `,
}
