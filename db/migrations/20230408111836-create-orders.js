'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('orders', {
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
        primaryKey: true,
        allowNull: false
      },
      staffUuid: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      tableUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      paid: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      status: {
        type: Sequelize.DataTypes.STRING(24),
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('orders')
  }
}
