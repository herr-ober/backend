'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('orders', 'notes', {
      type: Sequelize.DataTypes.STRING(256),
      allowNull: true,
      defaultValue: null
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('orders', 'notes')
  }
}
