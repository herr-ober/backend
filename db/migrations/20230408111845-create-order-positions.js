'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('order_positions', {
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
      orderUuid: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      productUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      amount: {
        type: Sequelize.DataTypes.INTEGER,
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
    return queryInterface.dropTable('order_positions')
  }
}
