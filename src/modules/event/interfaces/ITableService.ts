import { ICreateTableData, ITable } from '../types'

export interface ITableService {
  createTable(data: ICreateTableData): Promise<ITable>
  createMultipleTables(data: ICreateTableData): Promise<ITable[]>
  getTableByUuid(uuid: string): Promise<ITable | null>
  getTableByNumber(number: number): Promise<ITable | null>
  getAllTablesByEventUuid(eventUuid: string): Promise<ITable[] | null>
  deleteTableByUuid(uuid: string, suppressError?: boolean): Promise<number>
  deleteAllTablesByEventUuid(uuid: string, suppressError?: boolean): Promise<number>
}
