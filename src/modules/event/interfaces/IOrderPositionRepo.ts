import { OrderStatus } from '../enums'
import { ICreateOrderPositionData, IOrderPosition, IUpdateOrderPositionData } from '../types'

export interface IOrderPositionRepo {
  create(data: ICreateOrderPositionData): Promise<IOrderPosition>
  getByUuid(uuid: string, scopes?: string[]): Promise<IOrderPosition | null>
  getAllByOrderUuid(orderUuid: string, scopes?: string[]): Promise<IOrderPosition[]>
  getAllByStatus(status: OrderStatus, scopes?: string[]): Promise<IOrderPosition[]>
  updateByUuid(uuid: string, updates: IUpdateOrderPositionData): Promise<number[]>
  deleteByUuid(uuid: string): Promise<number>
  deleteAllByOrderUuid(orderUuid: string): Promise<number>
}
