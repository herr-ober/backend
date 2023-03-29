/* eslint-disable no-use-before-define */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { randomCode } from '../../../common/util/codeUtil'
import { uniqueId } from '../../../common/util/uuidUtil'
import { ITable } from '../types'

class TableModel extends Model<InferAttributes<TableModel>, InferCreationAttributes<TableModel>> implements ITable {
    declare id: CreationOptional<number>
    declare uuid: CreationOptional<string>
    declare tableNumber: number
    declare eventUuid: string
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export default function (sequelize: Sequelize) {
    TableModel.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                unique: true,
                allowNull: false,
                defaultValue: () => {
                    return uniqueId()
                  }
            },
            uuid: {
                type: DataTypes.STRING(36),
                allowNull: false,
                defaultValue: () => {
                    return uniqueId()
                }
            },
            tableNumber: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
            eventUuid: {
                type: DataTypes.STRING(36),
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Table',
            tableName: 'event_tables',
            timestamps: true,
            freezeTableName: true
        }
    )

    return TableModel
}