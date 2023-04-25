/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/util/uuidUtil'
import { IOrder } from '../types'
import { OrderStatus } from '../enums'

class OrderModel extends Model<InferAttributes<OrderModel>, InferCreationAttributes<OrderModel>> implements IOrder {
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare eventUuid: string
  declare staffUuid: string
  declare tableUuid: string
  declare paid: CreationOptional<boolean>
  declare status: CreationOptional<string>
  declare notes: CreationOptional<string>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  OrderModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.STRING(36),
        allowNull: false,
        defaultValue: () => {
          return uniqueId()
        }
      },
      eventUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      staffUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      tableUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: OrderStatus.NEW
      },
      notes: {
        type: DataTypes.STRING(256),
        allowNull: true,
        defaultValue: null
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
      freezeTableName: true
    }
  )

  return OrderModel
}
