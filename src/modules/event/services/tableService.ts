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

  async deleteTableByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.tableRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadTableDeletionDataError('Failed to delete Table - 0 rows affected')
    }
    return affectedRows
  }

  async deleteAllTablesByEventUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.tableRepo.deleteAllByEventUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadTableDeletionDataError('Failed to delete Table - 0 rows affected')
    }
    return affectedRows
  }
}

export default TableService
