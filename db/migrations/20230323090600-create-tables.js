'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('event_tables', {
      id: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      uuid: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      eventUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      tableNumber: {
        type: Sequelize.DataTypes.INTEGER,
        default: false,
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('event_tables')
  }
}
