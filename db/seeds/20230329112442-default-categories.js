'use strict'
const crypto = require('crypto')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('product_categories', [
      {
        uuid: crypto.randomUUID(),
        name: 'Vorspeisen',
        iconName: 'starters.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Hauptgerichte',
        iconName: 'mains.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Nachspeisen',
        iconName: 'desserts.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Alkoholfreie Getränke',
        iconName: 'non-alcoholic.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uuid: crypto.randomUUID(),
        name: 'Alkoholische Getränke',
        iconName: 'alcoholic.svg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  }
}
