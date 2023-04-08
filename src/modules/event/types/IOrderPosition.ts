import { IDatabaseModel } from '../../../common/interfaces'

export interface IOrderPosition extends IDatabaseModel {
  uuid: string
  orderUuid: string
  productUuid: string
  amount: number
  status: string
}
