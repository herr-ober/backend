/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { uniqueId } from '../../../common/util/uuidUtil'
import { IEvent } from '../types'

class EventModel extends Model<InferAttributes<EventModel>, InferCreationAttributes<EventModel>> implements IEvent {
  declare id: CreationOptional<number>
  declare uuid: CreationOptional<string>
  declare organizerUuid: string
  declare name: string
  declare location: string
  declare date: Date

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
  EventModel.init(
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
      organizerUuid: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      location: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'events',
      timestamps: true,
      freezeTableName: true
    }
  )

  return EventModel
}
