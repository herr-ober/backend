import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import {
  BadStaffDeletionDataError,
  CategoryNotFoundError,
  EventNotFoundError,
  ProductAlreadyExistsError
} from '../errors'
import { ICategoryRepo, IEventRepo, IProductRepo, IProductService } from '../interfaces'
import { ICategory, ICreateProductData, IEvent, IProduct } from '../types'

@injectable()
class ProductService implements IProductService {
  private readonly eventRepo: IEventRepo
  private readonly categoryRepo: ICategoryRepo
  private readonly productRepo: IProductRepo

  public constructor(
    @inject(DI_TYPES.EventRepo) eventRepo: IEventRepo,
    @inject(DI_TYPES.CategoryRepo) categoryRepo: ICategoryRepo,
    @inject(DI_TYPES.ProductRepo) productRepo: IProductRepo
  ) {
    this.eventRepo = eventRepo
    this.categoryRepo = categoryRepo
    this.productRepo = productRepo
  }

  async getCategories(): Promise<ICategory[]> {
    return this.categoryRepo.getAll()
  }

  async createProduct(data: ICreateProductData): Promise<IProduct> {
    const event: IEvent | null = await this.eventRepo.getByUuid(data.eventUuid)
    if (!event) throw new EventNotFoundError('Cannot find provided event')

    const category: ICategory | null = await this.categoryRepo.getByUuid(data.categoryUuid)
    if (!category) throw new CategoryNotFoundError('Cannot find provided category')

    const existing: IProduct | null = await this.productRepo.getByNameAndEvent(data.eventUuid, data.name)
    if (existing) throw new ProductAlreadyExistsError('A product with this name already exists')

    return this.productRepo.create(data)
  }

  async getProductByUuid(uuid: string): Promise<IProduct | null> {
    return this.productRepo.getByUuid(uuid)
  }

  async getProductsByEventUuid(eventUuid: string): Promise<IProduct[]> {
    return this.productRepo.getAllByEventUuid(eventUuid)
  }

  async getProductsByCategory(eventUuid: string, categoryUuid: string): Promise<IProduct[]> {
    return this.productRepo.getAllByCategoryUuid(eventUuid, categoryUuid)
  }

  async deleteProductByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.productRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete product - 0 rows affected')
    }
    return affectedRows
  }

  async deleteAllProductsByEventUuid(eventUuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.productRepo.deleteAllByEventUuid(eventUuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete product - 0 rows affected')
    }
    return affectedRows
  }
}

export default ProductService
