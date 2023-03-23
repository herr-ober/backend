import { IDatabaseModel } from '../../../common/interfaces'

export interface ITable extends IDatabaseModel {
  id: number
  uuid: string
  tableNumber: number
  eventUuid: string
}