import { OrderStatus } from '../enums'
import { ICreateOrderData, IOrder, IUpdateOrderData } from '../types'

export interface IOrderRepo {
  create(data: ICreateOrderData): Promise<IOrder>
  getByUuid(uuid: string, scopes?: string[]): Promise<IOrder | null>
  getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IOrder[]>
  getAllByStatus(eventUuid: string, status: OrderStatus, scopes?: string[]): Promise<IOrder[]>
  updateByUuid(uuid: string, updates: IUpdateOrderData): Promise<number[]>
  deleteByUuid(uuid: string): Promise<number>
  deleteAllByEventUuid(eventUuid: string): Promise<number>
}
