import { ICreateProductData, IProduct, IUpdateProductData } from '../types'

export interface IProductRepo {
  create(data: ICreateProductData): Promise<IProduct>
  getByUuid(uuid: string, scopes?: string[]): Promise<IProduct | null>
  getByNameAndEvent(eventUuid: string, name: string, scopes?: string[]): Promise<IProduct | null>
  getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IProduct[]>
  getAllByCategoryUuid(eventUuid: string, categoryUuid: string, scopes?: string[]): Promise<IProduct[]>
  updateByUuid(uuid: string, data: IUpdateProductData, scopes?: string[]): Promise<IProduct | null>
  deleteByUuid(uuid: string): Promise<number>
  deleteAllByEventUuid(eventUuid: string): Promise<number>
}
