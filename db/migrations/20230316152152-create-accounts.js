'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('accounts', {
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
      email: {
        type: Sequelize.DataTypes.STRING(64),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false
      },
      passwordHash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('accounts')
  }
}
