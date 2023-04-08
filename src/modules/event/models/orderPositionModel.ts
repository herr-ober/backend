/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/util/uuidUtil'
import { IOrderPosition } from '../types'
import { OrderPositionStatus } from '../enums'

class OrderPositionModel
  extends Model<InferAttributes<OrderPositionModel>, InferCreationAttributes<OrderPositionModel>>
  implements IOrderPosition
{
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare orderUuid: string
  declare productUuid: string
  declare amount: number
  declare status: CreationOptional<string>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  OrderPositionModel.init(
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
      orderUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      productUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(24),
        allowNull: false,
        defaultValue: OrderPositionStatus.WAITING
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'OrderPosition',
      tableName: 'order_positions',
      timestamps: true,
      freezeTableName: true
    }
  )

  return OrderPositionModel
}
