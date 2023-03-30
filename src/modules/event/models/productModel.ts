/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/util/uuidUtil'
import { IProduct } from '../types'

class ProductModel
  extends Model<InferAttributes<ProductModel>, InferCreationAttributes<ProductModel>>
  implements IProduct
{
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare eventUuid: string
  declare categoryUuid: string
  declare name: string
  declare price: number

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  ProductModel.init(
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
      categoryUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      price: {
        type: DataTypes.DOUBLE(7, 2),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      freezeTableName: true
    }
  )

  return ProductModel
}
