import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { IOrderPositionRepo, IOrderRepo, IOrderService } from '../interfaces'
import {
  ICreateOrderData,
  ICreateOrderPositionData,
  IOrder,
  IOrderPosition,
  IUpdateOrderData,
  IUpdateOrderPositionData
} from '../types'
import { OrderPositionStatus, OrderStatus } from '../enums'
import {
  BadOrderDeletionDataError,
  BadOrderPositionUpdateDataError,
  BadOrderUpdateDataError,
  OrderNotFoundError
} from '../errors'

@injectable()
class OrderService implements IOrderService {
  private readonly orderRepo: IOrderRepo
  private readonly orderPositionRepo: IOrderPositionRepo

  public constructor(
    @inject(DI_TYPES.OrderRepo) orderRepo: IOrderRepo,
    @inject(DI_TYPES.OrderPositionRepo) orderPositionRepo: IOrderPositionRepo
  ) {
    this.orderRepo = orderRepo
    this.orderPositionRepo = orderPositionRepo
  }

  async createOrder(data: ICreateOrderData): Promise<IOrder> {
    const order: IOrder = await this.orderRepo.create(data)
    data.positions.forEach((createData: ICreateOrderPositionData) => {
      createData.orderUuid = order.uuid
      this.orderPositionRepo.create(createData)
    })
    return order
  }

  async getOrderByUuid(uuid: string): Promise<IOrder | null> {
    return this.orderRepo.getByUuid(uuid)
  }

  async getOrdersByEventUuid(eventUuid: string): Promise<IOrder[]> {
    return this.orderRepo.getAllByEventUuid(eventUuid)
  }

  async getOrdersByStatus(eventUuid: string, status: OrderStatus): Promise<IOrder[]> {
    return this.orderRepo.getAllByStatus(eventUuid, status)
  }

  async getOrderPositions(orderUuid: string): Promise<IOrderPosition[]> {
    return this.orderPositionRepo.getAllByOrderUuid(orderUuid)
  }

  async updateOrderByUuid(orderUuid: string, updates: IUpdateOrderData): Promise<number[]> {
    const affectedRows: number[] = await this.orderRepo.updateByUuid(orderUuid, updates)
    if (!affectedRows[0]) {
      throw new BadOrderUpdateDataError('Failed to update order - 0 rows affected')
    }
    return affectedRows
  }

  async updateOrderPositionByUuid(orderPositionUuid: string, updates: IUpdateOrderPositionData): Promise<number[]> {
    const affectedRows: number[] = await this.orderPositionRepo.updateByUuid(orderPositionUuid, updates)
    if (!affectedRows[0]) {
      throw new BadOrderPositionUpdateDataError('Failed to update order position - 0 rows affected')
    }
    await this.updateOrderByPositionStatus(orderPositionUuid)
    return affectedRows
  }

  async updateOrderByPositionStatus(orderPositionUuid: string): Promise<void> {
    const orderPosition: IOrderPosition | null = await this.orderPositionRepo.getByUuid(orderPositionUuid)
    if (!orderPosition) throw new OrderNotFoundError('Associated order does not exist')
    const positions: IOrderPosition[] = await this.orderPositionRepo.getAllByOrderUuid(orderPosition.orderUuid)
    let allDelivered: boolean = true
    positions.forEach((position: IOrderPosition) => {
      if (position.status !== OrderPositionStatus.DELIVERED) allDelivered = false
    })
    if (allDelivered) this.orderRepo.updateByUuid(orderPosition.orderUuid, { status: OrderStatus.COMPLETED })
  }

  async deleteOrderByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.orderRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadOrderDeletionDataError('Failed to delete order - 0 rows affected')
    }
    return affectedRows
  }
}

export default OrderService
