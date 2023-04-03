import { IDatabaseModel } from '../../../common/interfaces'

export interface ITable extends IDatabaseModel {
  uuid: string
  tableNumber: number
  eventUuid: string
}
