import { OrderStatus } from '../enums'

export interface IUpdateOrderData {
  status?: OrderStatus
  paid?: boolean
}
