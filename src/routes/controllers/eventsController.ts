import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { container } from '../../modules/dependencyContainer'
import * as EventModule from '../../modules/event'
import { asNumber, asString } from '../../common/helpers/dataHelper'

const eventService: EventModule.interfaces.IEventService = container.get(EventModule.DI_TYPES.EventService)
const staffService: EventModule.interfaces.IStaffService = container.get(EventModule.DI_TYPES.StaffService)
const productService: EventModule.interfaces.IProductService = container.get(EventModule.DI_TYPES.ProductService)
const tableService: EventModule.interfaces.ITableService = container.get(EventModule.DI_TYPES.TableService)
const orderService: EventModule.interfaces.IOrderService = container.get(EventModule.DI_TYPES.OrderService)

async function createEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)
  const name: string = req.body.name
  const location: string = req.body.location
  const date: Date = req.body.date

  return eventService
    .createEvent({ organizerUuid, name, location, date })
    .then((event: EventModule.types.IEvent) => {
      return res.status(201).json({ uuid: event.uuid, name: event.name })
    })
    .catch((error: Error) => {
      logger.error('Event creation error', { error })
      throw new InternalError('Failed to create event')
    })
}

async function getEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return res.status(200).json({ uuid: event.uuid, name: event.name, location: event.location, date: event.date })
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.EventNotFoundError) {
        next(error)
      } else {
        logger.error('Event retrieval error', { error })
        throw new InternalError('Failed to retrieve event')
      }
    })
}

async function updateEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)
  const updates: object = req.body.updates

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return eventService.updateEventByUuid(event.uuid, updates)
    })
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof EventModule.errors.BadEventUpdateDataError ||
        error instanceof EventModule.errors.EventNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Event update error', { error })
        throw new InternalError('Failed to update event')
      }
    })
}

async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  const organizerUuid: string = asString(req.auth!.uuid)

  return eventService
    .getEventByOrganizerUuid(organizerUuid)
    .then((event: EventModule.types.IEvent | null) => {
      if (!event)
        throw new EventModule.errors.EventNotFoundError('Cannot find event associated to requesting organizer')

      return eventService.deleteEventByUuid(event.uuid)
    })
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof EventModule.errors.BadEventDeletionDataError ||
        error instanceof EventModule.errors.EventNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Event deletion error', { error })
        throw new InternalError('Failed to delete event')
      }
    })
}

async function addStaff(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const name: string = req.body.name
  const role: EventModule.enums.StaffRole = req.body.role

  return staffService
    .createStaff({ eventUuid, name, role })
    .then((staff: EventModule.types.IStaff) => {
      return res.status(201).json({ uuid: staff.uuid, code: staff.code })
    })
    .catch((error: Error) => {
      logger.error('Add staff error', { error })
      throw new InternalError('Failed to add staff')
    })
}

async function authStaffCode(req: Request, res: Response, next: NextFunction) {
  const code: string = req.body.code

  return staffService
    .authStaffCode({ code })
    .then(({ name, role, token }: EventModule.types.IGetStaff) => {
      return res.status(200).json({ name, role, token })
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.InvalidAuthCodeDataError) {
        next(error)
      } else {
        logger.error('Code auth error', { error })
        throw new InternalError('Failed to authenticate by staff code')
      }
    })
}

async function getStaff(req: Request, res: Response, next: NextFunction) {
  const staffUuid: string = asString(req.params.staffUuid)

  return staffService
    .getStaffByUuid(staffUuid)
    .then((staff: EventModule.types.IStaff | null) => {
      if (!staff) throw new EventModule.errors.StaffNotFoundError('Staff does not exist')

      return res.status(200).json(staff)
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.StaffNotFoundError) {
        next(error)
      } else {
        logger.error('Staff retrieval error', { error })
        throw new InternalError('Failed to retrieve staff by uuid')
      }
    })
}

async function getAllStaff(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)

  return staffService
    .getAllStaffByEventUuid(eventUuid)
    .then((staffList: EventModule.types.IStaff[]) => {
      return res.status(200).json({ staffList })
    })
    .catch((error: Error) => {
      logger.error('Staff retrieval error', { error })
      throw new InternalError('Failed to retrieve staff')
    })
}

async function updateStaff(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid
  const updates: object = req.body.updates

  return staffService
    .updateStaffByUuid(uuid, updates)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadStaffUpdateDataError) {
        next(error)
      } else {
        logger.error('Staff update error', { error })
        throw new InternalError('Failed to update staff')
      }
    })
}

async function removeStaff(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid

  return staffService
    .deleteStaffByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadStaffDeletionDataError) {
        next(error)
      } else {
        logger.error('Staff deletion error', { error })
        throw new InternalError('Failed to delete staff')
      }
    })
}

async function addTable(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const tableNumber: number = asNumber(req.body.tableNumber)

  return tableService
    .createTable({ eventUuid, tableNumber })
    .then((table: EventModule.types.ITable) => {
      return res.status(200).json({ table: { uuid: table.uuid, tableNumber: table.tableNumber } })
    })
    .catch((error: Error) => {
      logger.error('Add single table error', { error })
      throw new InternalError('Failed to add singel table', error.message)
    })
}

async function addMultipleTables(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const tableNumber: number = asNumber(req.body.tableNumber)

  return tableService
    .createMultipleTables({ eventUuid, tableNumber })
    .then((tables: EventModule.types.ITable[]) => {
      const tableArray = tables.map((table) => {
        return { uuid: table.uuid, tableNumber: table.tableNumber }
      })
      return res.status(200).json({ tables: tableArray })
    })
    .catch((error: Error) => {
      logger.error('Add multiple table error', { error })
      throw new InternalError('Failed to add multiple table')
    })
}

async function getTables(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)

  return tableService
    .getAllTablesByEventUuid(eventUuid)
    .then((tableList: EventModule.types.ITable[] | null) => {
      return res.status(200).json({ tableList })
    })
    .catch((error: Error) => {
      logger.error('Table retrieval error', { error })
      throw new InternalError('Failed to retrieve table')
    })
}

async function removeTable(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid

  return tableService
    .deleteTableByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadStaffDeletionDataError) {
        next(error)
      } else {
        logger.error('Table deletion error', { error })
        throw new InternalError('Failed to delete Table')
      }
    })
}

async function getCategories(req: Request, res: Response, next: NextFunction) {
  return productService
    .getCategories()
    .then((categories: EventModule.types.ICategory[]) => {
      return res.status(200).json({ categoryList: categories })
    })
    .catch((error: Error) => {
      logger.error('Product categories retrieval error', { error })
      throw new InternalError('Failed to retrieve product categories')
    })
}

async function createProduct(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const categoryUuid: string = req.body.categoryUuid
  const name: string = asString(req.body.name).trim()
  const price: number = req.body.price

  return productService
    .createProduct({ eventUuid, categoryUuid, name, price })
    .then((product: EventModule.types.IProduct) => {
      return res.status(201).json({ uuid: product.uuid })
    })
    .catch((error: Error) => {
      if (
        error instanceof EventModule.errors.ProductAlreadyExistsError ||
        error instanceof EventModule.errors.CategoryNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Create product error', { error })
        throw new InternalError('Failed to create product')
      }
    })
}

async function getProduct(req: Request, res: Response, next: NextFunction) {
  const uuid: string = asString(req.params.productUuid)

  return productService
    .getProductByUuid(uuid)
    .then((product: EventModule.types.IProduct | null) => {
      if (!product) throw new EventModule.errors.ProductNotFoundError('Cannot find requested product')

      return res
        .status(200)
        .json({ uuid: product.uuid, categoryUuid: product.categoryUuid, name: product.name, price: product.price })
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.ProductNotFoundError) {
        next(error)
      } else {
        logger.error('Product retrieval error', { error })
        throw new InternalError('Failed to retrieve product')
      }
    })
}

async function getProducts(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const categoryUuid: string | undefined = req.query.category as string | undefined

  if (!categoryUuid) {
    return productService
      .getProductsByEventUuid(eventUuid)
      .then((productList: EventModule.types.IProduct[]) => {
        return res.status(200).json({ productList })
      })
      .catch((error: Error) => {
        logger.error('Products retrieval error', { error })
        throw new InternalError('Failed to retrieve products')
      })
  }

  return productService
    .getProductsByCategory(eventUuid, categoryUuid)
    .then((productList: EventModule.types.IProduct[]) => {
      return res.status(200).json({ productList })
    })
    .catch((error: Error) => {
      logger.error('Products retrieval error', { error })
      throw new InternalError('Failed to retrieve products')
    })
}

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid

  return productService
    .deleteProductByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      logger.error('Product removal error', { error })
      throw new InternalError('Failed to remove product')
    })
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const staffUuid: string = asString(req.auth!.uuid)
  const tableUuid: string = req.body.tableUuid
  const positions: EventModule.types.ICreateOrderPositionData[] = req.body.positions
  const notes: string = req.body.notes || null

  return orderService
    .createOrder({ eventUuid, staffUuid, tableUuid, positions, notes })
    .then((order: EventModule.types.IOrder) => {
      return res.status(201).json({ orderUuid: order.uuid })
    })
    .catch((error: Error) => {
      logger.error('Order creation error', { error })
      throw new InternalError('Failed to create order')
    })
}

async function getOrders(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)

  return orderService
    .getOrdersByEventUuid(eventUuid)
    .then(async (orders: EventModule.types.IOrder[]) => {
      const orderList: object[] = []

      for (const order of orders) {
        const positions: EventModule.types.IOrderPosition[] = await orderService.getOrderPositions(order.uuid)

        orderList.push({
          orderId: order.id,
          orderUuid: order.uuid,
          staffUuid: order.staffUuid,
          tableUuid: order.tableUuid,
          paid: order.paid,
          status: order.status,
          notes: order.notes,
          positions
        })
      }

      return res.status(200).json(orderList)
    })
    .catch((error: Error) => {
      logger.error('Order retrieval error', { error })
      throw new InternalError('Failed to retrieve orders')
    })
}

async function getOrdersByStatus(req: Request, res: Response, next: NextFunction) {
  const eventUuid: string = asString(req.params.eventUuid)
  const status: EventModule.enums.OrderStatus = asString(req.params.status) as EventModule.enums.OrderStatus

  return orderService
    .getOrdersByStatus(eventUuid, status)
    .then(async (orders: EventModule.types.IOrder[]) => {
      const orderList: object[] = []

      for (const order of orders) {
        const positions: EventModule.types.IOrderPosition[] = await orderService.getOrderPositions(order.uuid)

        orderList.push({
          orderId: order.id,
          orderUuid: order.uuid,
          staffUuid: order.staffUuid,
          tableUuid: order.tableUuid,
          paid: order.paid,
          status: order.status,
          notes: order.notes,
          positions
        })
      }

      return res.status(200).json(orderList)
    })
    .catch((error: Error) => {
      logger.error('Order retrieval error', { error })
      throw new InternalError('Failed to retrieve orders by status')
    })
}

async function getOrder(req: Request, res: Response, next: NextFunction) {
  const orderUuid: string = asString(req.params.orderUuid)

  return orderService
    .getOrderByUuid(orderUuid)
    .then(async (order: EventModule.types.IOrder | null) => {
      if (!order) throw new EventModule.errors.OrderNotFoundError('Requested order does not exist')
      const positions: EventModule.types.IOrderPosition[] = await orderService.getOrderPositions(order.uuid)

      return res.status(200).json({
        id: order.id,
        uuid: order.uuid,
        eventUuid: order.eventUuid,
        staffUuid: order.staffUuid,
        tableUuid: order.tableUuid,
        paid: order.paid,
        status: order.status,
        notes: order.notes,
        positions
      })
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.OrderNotFoundError) {
        next(error)
      } else {
        logger.error('Order retrieval error', { error })
        throw new InternalError('Failed to retrieve order')
      }
    })
}

async function updateOrder(req: Request, res: Response, next: NextFunction) {
  const orderUuid: string = req.body.uuid
  const updates: EventModule.types.IUpdateOrderData = req.body.updates

  return orderService
    .updateOrderByUuid(orderUuid, updates)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadOrderUpdateDataError) {
        next(error)
      } else {
        logger.error('Order update error', { error })
        throw new InternalError('Failed to update order')
      }
    })
}

async function updateOrderPosition(req: Request, res: Response, next: NextFunction) {
  const orderPositionUuid: string = req.body.uuid
  const updates: EventModule.types.IUpdateOrderPositionData = req.body.updates

  return orderService
    .updateOrderPositionByUuid(orderPositionUuid, updates)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadOrderPositionUpdateDataError) {
        next(error)
      } else {
        logger.error('Order position update error', { error })
        throw new InternalError('Failed to update order position')
      }
    })
}

async function deleteOrder(req: Request, res: Response, next: NextFunction) {
  const orderUuid: string = req.body.uuid

  return orderService
    .deleteOrderByUuid(orderUuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof EventModule.errors.BadOrderDeletionDataError) {
        next(error)
      } else {
        logger.error('Order deletion error', { error })
        throw new InternalError('Failed to delete order')
      }
    })
}

export default {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  addStaff,
  authStaffCode,
  getStaff,
  getAllStaff,
  updateStaff,
  removeStaff,
  getCategories,
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  getTables,
  addMultipleTables,
  addTable,
  removeTable,
  createOrder,
  getOrders,
  getOrdersByStatus,
  getOrder,
  updateOrder,
  updateOrderPosition,
  deleteOrder
}
