import { IDatabaseModel } from '../../../common/interfaces'

export interface IOrder extends IDatabaseModel {
  uuid: string
  eventUuid: string
  staffUuid: string
  tableUuid: string
  paid: boolean
  status: string
}
