/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/util/uuidUtil'
import { ICategory } from '../types'

class CategoryModel
  extends Model<InferAttributes<CategoryModel>, InferCreationAttributes<CategoryModel>>
  implements ICategory
{
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare name: string
  declare iconName: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  CategoryModel.init(
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
      name: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      iconName: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'product_categories',
      timestamps: true,
      freezeTableName: true
    }
  )

  return CategoryModel
}
