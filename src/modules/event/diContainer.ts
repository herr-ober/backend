import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import {
  ICategoryRepo,
  IEventRepo,
  IEventService,
  IOrderPositionRepo,
  IOrderRepo,
  IOrderService,
  IProductRepo,
  IProductService,
  IStaffRepo,
  IStaffService,
  ITableRepo,
  ITableService
} from './interfaces'
import CategoryRepo from './repos/categoryRepo'
import EventRepo from './repos/eventRepo'
import OrderPositionRepo from './repos/orderPositionRepo'
import OrderRepo from './repos/orderRepo'
import ProductRepo from './repos/productRepo'
import StaffRepo from './repos/staffRepo'
import TableRepo from './repos/tableRepo'
import EventService from './services/eventService'
import OrderService from './services/orderService'
import ProductService from './services/productService'
import StaffService from './services/staffService'
import TableService from './services/tableService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<IEventRepo>(DI_TYPES.EventRepo).to(EventRepo)
container.bind<IEventService>(DI_TYPES.EventService).to(EventService)

container.bind<IStaffRepo>(DI_TYPES.StaffRepo).to(StaffRepo)
container.bind<IStaffService>(DI_TYPES.StaffService).to(StaffService)

container.bind<ICategoryRepo>(DI_TYPES.CategoryRepo).to(CategoryRepo)
container.bind<IProductRepo>(DI_TYPES.ProductRepo).to(ProductRepo)
container.bind<IProductService>(DI_TYPES.ProductService).to(ProductService)

container.bind<ITableRepo>(DI_TYPES.TableRepo).to(TableRepo)
container.bind<ITableService>(DI_TYPES.TableService).to(TableService)

container.bind<IOrderRepo>(DI_TYPES.OrderRepo).to(OrderRepo)
container.bind<IOrderPositionRepo>(DI_TYPES.OrderPositionRepo).to(OrderPositionRepo)
container.bind<IOrderService>(DI_TYPES.OrderService).to(OrderService)

export default container
