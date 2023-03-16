import { inject, injectable } from 'inversify'
import { generateHash } from '../../../common/util/hashingUtil'
import { DI_TYPES } from '../diTypes'
import {
  BadAccountCreationDataError,
  BadAccountDeletionDataError,
  BadAccountUpdateDataError
} from '../errors'
import { IAccountRepo, IAccountService } from '../interfaces'
import { IAccount, ICreateAccountData, IUpdateAccountData } from '../types'

@injectable()
class AccountService implements IAccountService {
  private readonly accountRepo: IAccountRepo

  public constructor(@inject(DI_TYPES.AccountRepo) accountRepo: IAccountRepo) {
    this.accountRepo = accountRepo
  }

  async createAccount(data: ICreateAccountData): Promise<IAccount> {
    const existingAccount: IAccount | null = await this.getAccountByEmail(
      data.email
    )
    if (existingAccount)
      throw new BadAccountCreationDataError(
        'Email is already associated with an account'
      )

    data.passwordHash = await generateHash(data.password)
    return this.accountRepo.create(data)
  }

  async getAccountByUuid(uuid: string): Promise<IAccount | null> {
    return this.accountRepo.getByUuid(uuid)
  }

  async getAccountByEmail(email: string): Promise<IAccount | null> {
    return this.accountRepo.getByEmail(email)
  }

  async getAccountsByName(name: string): Promise<IAccount[]> {
    return this.accountRepo.getByName(name)
  }

  async updateAccountByUuid(
    uuid: string,
    data: IUpdateAccountData
  ): Promise<number[]> {
    const affectedRows: number[] = await this.accountRepo.updateByUuid(
      uuid,
      data
    )
    if (!affectedRows || !!affectedRows[0]) {
      throw new BadAccountUpdateDataError(
        'Failed to update sample - 0 rows affected'
      )
    }
    return affectedRows
  }

  async deleteAccountByUuid(
    uuid: string,
    suppressError: boolean = false
  ): Promise<number> {
    const affectedRows: number = await this.accountRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadAccountDeletionDataError(
        'Failed to delete sample - 0 rows affected'
      )
    }
    return affectedRows
  }
}

export default AccountService
