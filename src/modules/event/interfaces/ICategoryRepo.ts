import { ICategory } from '../types'

export interface ICategoryRepo {
  getByUuid(uuid: string, scopes?: string[]): Promise<ICategory | null>
  getAll(scopes?: string[]): Promise<ICategory[]>
}
