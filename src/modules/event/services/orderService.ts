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

  /**
   * This function creates an order and its associated order positions in a database.
   * @param {ICreateOrderData} data - ICreateOrderData - an interface that defines the data needed to
   * create an order. It likely includes information such as customer details, shipping address, and
   * payment information.
   * @returns The `createOrder` function is returning a Promise that resolves to an `IOrder` object.
   */
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

  /**
   * This function updates an order by its UUID and returns the number of affected rows.
   * @param {string} orderUuid - A string representing the unique identifier of an order.
   * @param {IUpdateOrderData} updates - updates is an object of type IUpdateOrderData which contains
   * the data to be updated for an order. The specific properties and their types within this object
   * would depend on the implementation of the IUpdateOrderData interface.
   * @returns an array of numbers, which represent the number of affected rows after updating an order
   * with the given UUID and the provided updates. If no rows were affected, the function throws a
   * `BadOrderUpdateDataError` with a message indicating that the update failed.
   */
  async updateOrderByUuid(orderUuid: string, updates: IUpdateOrderData): Promise<number[]> {
    const affectedRows: number[] = await this.orderRepo.updateByUuid(orderUuid, updates)
    if (!affectedRows[0]) {
      throw new BadOrderUpdateDataError('Failed to update order - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function updates an order position by UUID and returns the number of affected rows.
   * @param {string} orderPositionUuid - A string representing the unique identifier of an order
   * position.
   * @param {IUpdateOrderPositionData} updates - The `updates` parameter is an object of type
   * `IUpdateOrderPositionData` which contains the data to be updated for the order position.
   * @returns an array of numbers, which represents the number of affected rows after updating an order
   * position by UUID.
   */
  async updateOrderPositionByUuid(orderPositionUuid: string, updates: IUpdateOrderPositionData): Promise<number[]> {
    const affectedRows: number[] = await this.orderPositionRepo.updateByUuid(orderPositionUuid, updates)
    if (!affectedRows[0]) {
      throw new BadOrderPositionUpdateDataError('Failed to update order position - 0 rows affected')
    }
    await this.updateOrderByPositionStatus(orderPositionUuid)
    return affectedRows
  }

  /**
   * This function updates the status of an order based on the status of its order positions.
   * @param {string} orderPositionUuid - A string representing the unique identifier of an order
   * position.
   */
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

  /**
   * This function deletes an order and its associated order positions by UUID and returns the number
   * of affected rows.
   * @param {string} uuid - A string representing the unique identifier of the order to be deleted.
   * @param {boolean} [suppressError=false] - suppressError is a boolean parameter that is set to false
   * by default. If set to true, it will prevent the function from throwing an error if the deletion of
   * order positions or orders fails.
   * @returns a Promise that resolves to a number, which represents the number of rows affected by the
   * deletion of an order with the specified UUID.
   */
  async deleteOrderByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const positionsAffectedRows: number = await this.orderPositionRepo.deleteAllByOrderUuid(uuid)
    if (positionsAffectedRows < 0 && !suppressError) {
      throw new BadOrderDeletionDataError('Failed to delete order positions - 0 rows affected')
    }
    const affectedRows: number = await this.orderRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadOrderDeletionDataError('Failed to delete order - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes all orders associated with a given event UUID.
   * @param {string} eventUuid - A string representing the unique identifier of an event.
   * @param {boolean} [suppressError=false] - The `suppressError` parameter is a boolean flag that
   * determines whether or not to suppress errors that may occur during the deletion of orders. If set
   * to `true`, any errors that occur will not be thrown and the function will continue to execute. If
   * set to `false` (the default value),
   */
  async deleteAllOrdersByEventUuid(eventUuid: string, suppressError: boolean = false): Promise<void> {
    const orders: IOrder[] = await this.orderRepo.getAllByEventUuid(eventUuid)
    orders.forEach((order: IOrder) => {
      this.deleteOrderByUuid(order.uuid, suppressError)
    })
  }
}

export default OrderService
