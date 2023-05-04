import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { BadEventDeletionDataError, BadEventUpdateDataError } from '../errors'
import { IEventRepo, IEventService, IOrderService, IProductService, IStaffService, ITableService } from '../interfaces'
import { ICreateEventData, IEvent, IUpdateEventData } from '../types'

@injectable()
class EventService implements IEventService {
  private readonly eventRepo: IEventRepo
  private readonly orderService: IOrderService
  private readonly productService: IProductService
  private readonly staffService: IStaffService
  private readonly tableService: ITableService

  public constructor(
    @inject(DI_TYPES.EventRepo) eventRepo: IEventRepo,
    @inject(DI_TYPES.OrderService) orderService: IOrderService,
    @inject(DI_TYPES.ProductService) productService: IProductService,
    @inject(DI_TYPES.StaffService) staffService: IStaffService,
    @inject(DI_TYPES.TableService) tableService: ITableService
  ) {
    this.eventRepo = eventRepo
    this.orderService = orderService
    this.productService = productService
    this.staffService = staffService
    this.tableService = tableService
  }

  async createEvent(data: ICreateEventData): Promise<IEvent> {
    return this.eventRepo.create(data)
  }

  async getEventByUuid(uuid: string): Promise<IEvent | null> {
    return this.eventRepo.getByUuid(uuid)
  }

  async getEventByOrganizerUuid(organizerUuid: string): Promise<IEvent | null> {
    return this.eventRepo.getByOrganizerUuid(organizerUuid)
  }

  /**
   * This function updates an event by its UUID and returns the number of affected rows.
   * @param {string} uuid - A string representing the unique identifier of the event to be updated.
   * @param {IUpdateEventData} data - The `data` parameter is an object of type `IUpdateEventData`
   * which contains the updated data for an event. It is used to update an event in the database
   * identified by its `uuid`.
   * @returns an array of numbers, which represent the number of affected rows after updating an event
   * with the given UUID and data.
   */
  async updateEventByUuid(uuid: string, data: IUpdateEventData): Promise<number[]> {
    const affectedRows: number[] = await this.eventRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadEventUpdateDataError('Failed to update event - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes an event and all associated orders, products, staff, and tables by UUID.
   * @param {string} uuid - a string representing the unique identifier of the event to be deleted.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * errors. If set to true, errors will not be thrown and the function will return a value indicating
   * the number of affected rows. If set to false (default), errors will be thrown if the number of
   * affected rows is less than 0.
   * @returns a Promise that resolves to a number, which represents the number of affected rows after
   * deleting an event by its UUID.
   */
  async deleteEventByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    await this.orderService.deleteAllOrdersByEventUuid(uuid, suppressError)
    await this.productService.deleteAllProductsByEventUuid(uuid, suppressError)
    await this.staffService.deleteAllStaffByEventUuid(uuid, suppressError)
    await this.tableService.deleteAllTablesByEventUuid(uuid, suppressError)

    const affectedRows: number = await this.eventRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadEventDeletionDataError('Failed to delete event - 0 rows affected')
    }
    return affectedRows
  }
}

export default EventService
