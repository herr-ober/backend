import { IDatabaseModel } from '../../../common/interfaces'

export interface IProduct extends IDatabaseModel {
  uuid: string
  eventUuid: string
  categoryUuid: string
  name: string
  price: number
}
