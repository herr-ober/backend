import { ICategory, ICreateProductData, IProduct } from '../types'

export interface IProductService {
  getCategories(): Promise<ICategory[]>
  createProduct(data: ICreateProductData): Promise<IProduct>
  getProductByUuid(uuid: string): Promise<IProduct | null>
  getProductsByEventUuid(eventUuid: string): Promise<IProduct[]>
  getProductsByCategory(eventUuid: string, categoryUuid: string): Promise<IProduct[]>
  deleteProductByUuid(uuid: string, suppressError?: boolean): Promise<number>
  deleteAllProductsByEventUuid(eventUuid: string, suppressError?: boolean): Promise<number>
}
