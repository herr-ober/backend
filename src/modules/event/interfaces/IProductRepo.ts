import { ICreateProductData, IProduct } from '../types'

export interface IProductRepo {
  create(data: ICreateProductData): Promise<IProduct>
  getByUuid(uuid: string, scopes?: string[]): Promise<IProduct | null>
  getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IProduct[]>
  getAllByCategoryUuid(eventUuid: string, categoryUuid: string, scopes?: string[]): Promise<IProduct[]>
  deleteByUuid(uuid: string): Promise<number>
  deleteByEventUuid(eventUuid: string): Promise<number>
}
