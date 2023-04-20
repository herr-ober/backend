'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('product_categories', {
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
      name: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      iconName: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('product_categories')
  }
}
