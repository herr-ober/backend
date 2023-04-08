import { OrderStatus } from '../enums'
import { ICreateOrderData, IOrder, IOrderPosition, IUpdateOrderData, IUpdateOrderPositionData } from '../types'

export interface IOrderService {
  createOrder(data: ICreateOrderData): Promise<IOrder>
  getOrderByUuid(uuid: string): Promise<IOrder | null>
  getOrdersByEventUuid(eventUuid: string): Promise<IOrder[]>
  getOrdersByStatus(eventUuid: string, status: OrderStatus): Promise<IOrder[]>
  getOrderPositions(orderUuid: string): Promise<IOrderPosition[]>
  updateOrderByUuid(orderUuid: string, updates: IUpdateOrderData): Promise<number[]>
  updateOrderPositionByUuid(orderPositionUuid: string, updates: IUpdateOrderPositionData): Promise<number[]>
  deleteOrderByUuid(uuid: string, suppressError?: boolean): Promise<number>
}
