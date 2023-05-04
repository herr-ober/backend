import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { BadTableDeletionDataError } from '../errors'
import { ITableRepo, ITableService } from '../interfaces'
import { ICreateTableData, ITable } from '../types'

@injectable()
class TableService implements ITableService {
  private readonly tableRepo: ITableRepo

  public constructor(@inject(DI_TYPES.TableRepo) tableRepo: ITableRepo) {
    this.tableRepo = tableRepo
  }

  async createTable(data: ICreateTableData): Promise<ITable> {
    return this.tableRepo.create(data)
  }

  async createMultipleTables(data: ICreateTableData): Promise<ITable[]> {
    return this.tableRepo.createMultiple(data)
  }

  async getTableByUuid(uuid: string): Promise<ITable | null> {
    return this.tableRepo.getByUuid(uuid)
  }

  async getTableByNumber(number: number): Promise<ITable | null> {
    return this.tableRepo.getByNumber(number)
  }

  async getAllTablesByEventUuid(eventUuid: string): Promise<ITable[] | null> {
    return this.tableRepo.getAllByEventUuid(eventUuid)
  }

  /**
   * This function deletes a table by its UUID and returns the number of affected rows, throwing an
   * error if no rows were affected and suppressError is false.
   * @param {string} uuid - A string representing the unique identifier of the table to be deleted.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * the error if the deletion of the table fails. If set to true, the error will not be thrown and the
   * function will return the number of affected rows (which could be 0). If set to false (default), an
   * error will be thrown
   * @returns a Promise that resolves to a number, which represents the number of rows affected by the
   * deletion operation.
   */
  async deleteTableByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.tableRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadTableDeletionDataError('Failed to delete Table - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes all tables associated with a given event UUID and returns the number of
   * affected rows.
   * @param {string} uuid - A string representing the unique identifier of an event.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * the error if no rows were affected by the deletion. If set to true, the function will not throw an
   * error if no rows were deleted. If set to false (default), the function will throw a
   * `BadTableDeletionDataError` if
   * @returns a Promise that resolves to a number representing the number of affected rows after
   * deleting all tables with a specific event UUID.
   */
  async deleteAllTablesByEventUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.tableRepo.deleteAllByEventUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadTableDeletionDataError('Failed to delete Table - 0 rows affected')
    }
    return affectedRows
  }
}

export default TableService
