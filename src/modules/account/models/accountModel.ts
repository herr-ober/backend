/* eslint-disable no-use-before-define */
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize'
import { uniqueId } from '../../../common/helpers/uuidHelper'
import { IAccount } from '../types'

class AccountModel
  extends Model<
    InferAttributes<AccountModel>,
    InferCreationAttributes<AccountModel>
  >
  implements IAccount
{
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare email: string
  declare name: string
  declare passwordHash: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  AccountModel.init(
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
      email: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      timestamps: true,
      freezeTableName: true
    }
  )

  return AccountModel
}
