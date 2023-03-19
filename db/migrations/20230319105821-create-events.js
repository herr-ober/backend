'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('events', {
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
      organizerUuid: {
        type: Sequelize.DataTypes.STRING(36),
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      name: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      location: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('events')
  }
}
