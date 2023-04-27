import { ICategory, ICreateProductData, IProduct, IUpdateProductData } from '../types'

export interface IProductService {
  getCategories(): Promise<ICategory[]>
  createProduct(data: ICreateProductData): Promise<IProduct>
  getProductByUuid(uuid: string): Promise<IProduct | null>
  getProductsByEventUuid(eventUuid: string): Promise<IProduct[]>
  getProductsByCategory(eventUuid: string, categoryUuid: string): Promise<IProduct[]>
  updateProductByUuid(uuid: string, data: IUpdateProductData):Promise<IProduct | null>
  deleteProductByUuid(uuid: string, suppressError?: boolean): Promise<number>
}
