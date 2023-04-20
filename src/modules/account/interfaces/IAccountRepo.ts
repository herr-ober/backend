import { IAccount, ICreateAccountData, IUpdateAccountData } from '../types'

export interface IAccountRepo {
  create(data: ICreateAccountData): Promise<IAccount>
  getByUuid(uuid: string, scopes?: string[]): Promise<IAccount | null>
  getByEmail(email: string, scopes?: string[]): Promise<IAccount | null>
  updateByUuid(uuid: string, updates: IUpdateAccountData): Promise<number[]>
  deleteByUuid(uuid: string): Promise<number>
}
