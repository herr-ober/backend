/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { randomCode } from '../../../common/util/codeUtil'
import { uniqueId } from '../../../common/util/uuidUtil'
import { StaffRole } from '../enums'
import { IStaff } from '../types'

class StaffModel extends Model<InferAttributes<StaffModel>, InferCreationAttributes<StaffModel>> implements IStaff {
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare eventUuid: string
  declare name: string
  declare role: StaffRole
  declare code: string

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  StaffModel.init(
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
      name: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(...Object.values(StaffRole)),
        allowNull: false
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        defaultValue: () => {
          return randomCode()
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Staff',
      tableName: 'event_staff',
      timestamps: true,
      freezeTableName: true
    }
  )

  return StaffModel
}
