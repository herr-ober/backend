import { IAccount, IAuthPasswordData, ICreateAccountData, IUpdateAccountData } from '../types'

export interface IAccountService {
  createAccount(data: ICreateAccountData): Promise<IAccount>
  authPassword(data: IAuthPasswordData): Promise<string>
  authToken(token: string): Promise<IAccount>
  getAccountByUuid(uuid: string): Promise<IAccount | null>
  getAccountByEmail(email: string): Promise<IAccount | null>
  updateAccountByUuid(uuid: string, data: IUpdateAccountData): Promise<number[]>
  deleteAccountByUuid(uuid: string, suppressError?: boolean): Promise<number>
}
