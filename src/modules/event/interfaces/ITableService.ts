import { ICreateTableData, ITable } from '../types'

export interface ITableService {
    createTable(data: ICreateTableData): Promise<ITable>
    getTableByUuid(uuid: string): Promise<ITable | null>
    getTableByNumber(number: number): Promise<ITable | null>
    getAllTableByEventUuid(eventUuid: string): Promise<ITable[]>
    deleteTableByUuid(uuid: string, suppressError?: boolean): Promise<number>
}