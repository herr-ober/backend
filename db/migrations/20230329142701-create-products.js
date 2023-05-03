'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('products', {
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
      categoryUuid: {
        type: Sequelize.DataTypes.STRING(36),
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      price: {
        type: Sequelize.DataTypes.DOUBLE(7, 2),
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('products')
  }
}
