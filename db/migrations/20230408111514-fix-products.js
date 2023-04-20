'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('products', 'eventUuid')
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addConstraint('products', ['eventUuid'], {
      type: 'unique',
      name: 'eventUuid_unique_constraint'
    })
  }
}
