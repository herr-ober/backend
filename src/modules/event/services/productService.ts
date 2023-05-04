import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import {
  BadStaffDeletionDataError,
  CategoryNotFoundError,
  EventNotFoundError,
  ProductAlreadyExistsError
} from '../errors'
import { ICategoryRepo, IEventRepo, IProductRepo, IProductService } from '../interfaces'
import { ICategory, ICreateProductData, IEvent, IProduct, IUpdateProductData } from '../types'

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

  /**
   * This function creates a new product and checks if the event, category, and product name already
   * exist.
   * @param {ICreateProductData} data - ICreateProductData, which is an interface defining the data
   * needed to create a new product. It likely includes properties such as the name of the product, its
   * price, description, and the UUIDs of the event and category it belongs to.
   * @returns The function `createProduct` is returning a Promise that resolves to an object of type
   * `IProduct`.
   */
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

  async updateProductByUuid(uuid: string, data: IUpdateProductData): Promise<number[]> {
    return this.productRepo.updateByUuid(uuid, data)
  }

  /**
   * This is an async function that deletes a product by its UUID and returns the number of affected
   * rows, with an option to suppress errors.
   * @param {string} uuid - A string representing the unique identifier of the product to be deleted.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * the error if the deletion of the product fails. If set to true, the error will not be thrown and
   * the function will return the number of affected rows (which could be 0). If set to false
   * (default), the function will throw a
   * @returns a Promise that resolves to a number, which represents the number of rows affected by the
   * deletion operation.
   */
  async deleteProductByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.productRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete product - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes all products associated with a given event UUID and returns the number of
   * affected rows, with an option to suppress errors.
   * @param {string} eventUuid - A string representing the unique identifier of an event for which all
   * products need to be deleted.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * the error if no rows were affected by the deletion. If set to true, the function will not throw an
   * error if no rows were affected. If set to false (default), the function will throw a
   * `BadStaffDeletionDataError`
   * @returns a Promise that resolves to a number representing the number of affected rows after
   * deleting all products with a specific event UUID. If there was an error during the deletion and
   * `suppressError` is false, a `BadStaffDeletionDataError` will be thrown.
   */
  async deleteAllProductsByEventUuid(eventUuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.productRepo.deleteAllByEventUuid(eventUuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete product - 0 rows affected')
    }
    return affectedRows
  }
}

export default ProductService
