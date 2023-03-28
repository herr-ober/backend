import { ICreateTableData, ITable} from '../types'

export interface ITableRepo {
  create(data: ICreateTableData): Promise<ITable>
  createMultiple(data: ICreateTableData): Promise<ITable[]>
  getByUuid(uuid: string): Promise<ITable | null>
  getByNumber(number: number): Promise<ITable | null>
  getAllByEventUuid(eventUuid: string): Promise<ITable[] | null>
  deleteByUuid(uuid: string): Promise<number>
  deleteByEventUuid(eventUuid: string): Promise<number>
}
