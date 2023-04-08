'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.removeConstraint('products', 'unique')
  },

  async down(queryInterface, Sequelize) {
    queryInterface.addConstraint('products', ['eventUuid'], {
      type: 'unique',
      name: 'eventUuid-unique-constraint'
    })
  }
}
