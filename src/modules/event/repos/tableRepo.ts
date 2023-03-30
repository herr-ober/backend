import { injectable } from 'inversify'
import { ITableRepo } from '../interfaces'
import database from '../../databaseModels'
import { ICreateTableData, ITable } from '../types'

@injectable()
class TableRepo implements ITableRepo {
  /**
   * It creates a new tables in the database
   * @param {ICreateTableData} data - ICreateTableData
   * @returns A promise of a Table object
   */
  async create(data: ICreateTableData): Promise<ITable> {
    return database.Table.create(data)
  }

  /**
   * It creates multiple new tables in the database
   * @param {ICreateTableData} data - ICreateTableData
   * @returns A promise of a Array of Tables
   */
  async createMultiple(data: ICreateTableData): Promise<ITable[]> {
    const tableList: ITable[] = []
    const amount = data.tableNumber
    for (let i = 1; i <= amount; i++) {
      data.tableNumber = i
      console.log(data.tableNumber)
      tableList.push(await database.Table.create(data))
    }
    return tableList
  }

  /**
   * It returns a Table object that matches the uuid or tablenumber passed in
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - string[] | false
   * @returns A Staff object
   */

  async get(criteria: object): Promise<ITable | null> {
    return database.Table.destroy({
      where: criteria
    })
  }

  async getByUuid(uuid: string): Promise<ITable | null> {
    return this.get({ uuid })
  }

  async getByNumber(tableNumber: number): Promise<ITable | null> {
    return this.get({ tableNumber })
  }

  /**
   * It returns a promise of an array of Table objects
   * @param {object} eventUuid
   * @returns An array of Table objects
   */

  async getAllByEventUuid(eventUuid: string): Promise<ITable[] | null> {
    return database.Table.findAll()
  }

  /**
   * It deletes a staff member from the database
   * @param {object} uuid
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Table.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({
      uuid
    })
  }

  async deleteByEventUuid(eventUuid: string): Promise<number> {
    return this.delete({
      eventUuid
    })
  }
}

export default TableRepo
