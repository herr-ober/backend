import { IAccount, ICreateAccountData, IUpdateAccountData } from '../types'

export interface IAccountService {
  createAccount(data: ICreateAccountData): Promise<IAccount>
  getAccountByUuid(uuid: string): Promise<IAccount | null>
  getAccountByEmail(email: string): Promise<IAccount | null>
  getAccountsByName(name: string): Promise<IAccount[]>
  updateAccountByUuid(uuid: string, data: IUpdateAccountData): Promise<number[]>
  deleteAccountByUuid(uuid: string, suppressError?: boolean): Promise<number>
}