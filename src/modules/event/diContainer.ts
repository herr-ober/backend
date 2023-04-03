import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import {
  ICategoryRepo,
  IEventRepo,
  IEventService,
  IProductRepo,
  IProductService,
  IStaffRepo,
  IStaffService,
  ITableRepo,
  ITableService
} from './interfaces'
import CategoryRepo from './repos/categoryRepo'
import EventRepo from './repos/eventRepo'
import ProductRepo from './repos/productRepo'
import StaffRepo from './repos/staffRepo'
import TableRepo from './repos/tableRepo'
import EventService from './services/eventService'
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

export default container
