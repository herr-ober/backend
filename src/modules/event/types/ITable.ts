import { IDatabaseModel } from '../../../common/interfaces'

export interface ITable extends IDatabaseModel {
  id: string
  uuid: string
  tableNumber: number
  eventUuid: string
}