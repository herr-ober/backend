'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('event_staff', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
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
      name: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      role: {
        type: Sequelize.DataTypes.STRING(16),
        allowNull: false
      },
      code: {
        type: Sequelize.DataTypes.STRING(8),
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('event_staff')
  }
}
