import { inject, injectable } from 'inversify'
import * as jose from 'jose'
import { addTime } from '../../../common/helpers/dateHelper'
import { generateToken, verifyToken } from '../../../common/util/tokenUtil'
import { generateHash, verifyPassword } from '../../../common/util/hashingUtil'
import { DI_TYPES } from '../diTypes'
import {
  BadAccountCreationDataError,
  BadAccountDeletionDataError,
  BadAccountUpdateDataError,
  InvalidAuthPasswordDataError
} from '../errors'
import { IAccountRepo, IAccountService } from '../interfaces'
import {
  IAccount,
  IAuthPasswordData,
  ICreateAccountData,
  IUpdateAccountData
} from '../types'
import { TokenIssuer } from '../../../common/enums'

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

  async authPassword(data: IAuthPasswordData): Promise<string> {
    const account: IAccount | null = await this.getAccountByEmail(data.email)
    if (!account)
      throw new InvalidAuthPasswordDataError('Email or password incorrect')

    const credentialsMatch: boolean = await verifyPassword(
      account.passwordHash,
      data.password
    )
    if (!credentialsMatch)
      throw new InvalidAuthPasswordDataError('Email or password incorrect')

    const payload: jose.JWTPayload = {
      iss: TokenIssuer.ACCOUNT,
      sub: account.uuid,
      exp: addTime('1d').getTime()
    }
    return generateToken(payload)
  }

  async authToken(token: string): Promise<IAccount> {
    const payload: jose.JWTPayload = await verifyToken(token)
    const account: IAccount | null = await this.getAccountByUuid(payload.sub!)
    if (!account)
      throw new InvalidAuthPasswordDataError('Email or password incorrect')

    return account
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
    if (!affectedRows[0]) {
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
