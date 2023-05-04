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
import { IAccount, IAuthPasswordData, ICreateAccountData, IUpdateAccountData } from '../types'
import { TokenIssuer } from '../../../common/enums'
import * as EventModule from '../../event'

@injectable()
class AccountService implements IAccountService {
  private readonly accountRepo: IAccountRepo
  private readonly eventService: EventModule.interfaces.IEventService

  public constructor(
    @inject(DI_TYPES.AccountRepo) accountRepo: IAccountRepo,
    @inject(EventModule.DI_TYPES.EventService) eventService: EventModule.interfaces.IEventService
  ) {
    this.accountRepo = accountRepo
    this.eventService = eventService
  }

  /**
   * This function creates a new account with a unique email and a hashed password.
   * @param {ICreateAccountData} data - ICreateAccountData, which is an interface defining the shape of
   * the data required to create an account. It likely includes properties such as email, password, and
   * any other relevant information needed to create an account.
   * @returns The `createAccount` function is returning a Promise that resolves to an `IAccount`
   * object.
   */
  async createAccount(data: ICreateAccountData): Promise<IAccount> {
    const existingAccount: IAccount | null = await this.getAccountByEmail(data.email)
    if (existingAccount) throw new BadAccountCreationDataError('Email is already associated with an account')

    data.passwordHash = await generateHash(data.password)
    return this.accountRepo.create(data)
  }

  /**
   * This function authenticates a user's password and generates a JWT token for the user's account.
   * @param {IAuthPasswordData} data - An object containing the email and password of the user trying
   * to authenticate.
   * @returns An object containing a `token` string and an `account` object of type `IAccount`.
   */
  async authPassword(data: IAuthPasswordData): Promise<{ token: string; account: IAccount }> {
    const account: IAccount | null = await this.getAccountByEmail(data.email)
    if (!account) throw new InvalidAuthPasswordDataError('Email or password incorrect')

    const credentialsMatch: boolean = await verifyPassword(account.passwordHash, data.password)
    if (!credentialsMatch) throw new InvalidAuthPasswordDataError('Email or password incorrect')

    const payload: jose.JWTPayload = {
      iss: TokenIssuer.ACCOUNT,
      sub: account.uuid,
      exp: addTime('1d').getTime()
    }

    const token: string = await generateToken(payload)

    return { token, account }
  }

  /**
   * This function verifies a token and returns an account object if the token is valid.
   * @param {string} token - The `token` parameter is a string representing a JSON Web Token (JWT) that
   * is used for authentication. It is passed to the `authToken` function as an argument.
   * @returns an object of type `IAccount` wrapped in a Promise.
   */
  async authToken(token: string): Promise<IAccount> {
    const payload: jose.JWTPayload = await verifyToken(token)
    const account: IAccount | null = await this.getAccountByUuid(payload.sub!)
    if (!account) throw new InvalidAuthPasswordDataError('Email or password incorrect')

    return account
  }

  async getAccountByUuid(uuid: string): Promise<IAccount | null> {
    return this.accountRepo.getByUuid(uuid)
  }

  async getAccountByEmail(email: string): Promise<IAccount | null> {
    return this.accountRepo.getByEmail(email)
  }

  /**
   * This is an async function that updates an account by UUID and returns the number of affected rows.
   * @param {string} uuid - A string representing the unique identifier of an account that needs to be
   * updated.
   * @param {IUpdateAccountData} data - The `data` parameter is an object of type `IUpdateAccountData`
   * which contains the data to be updated for an account. It may contain properties such as
   * `password`, `passwordHash`, `email`, `firstName`, `lastName`, etc. If the `password` property is
   * present,
   * @returns an array of numbers, which represent the number of affected rows after updating an
   * account with the given UUID and data.
   */
  async updateAccountByUuid(uuid: string, data: IUpdateAccountData): Promise<number[]> {
    if (data.password) {
      data.passwordHash = await generateHash(data.password)
    }
    const affectedRows: number[] = await this.accountRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadAccountUpdateDataError('Failed to update account - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes an account by its UUID after checking if an event exists for the same
   * organizer UUID.
   * @param {string} uuid - The unique identifier of the account to be deleted.
   * @param {boolean} [suppressError=false] - suppressError is a boolean parameter that is set to false
   * by default. If set to true, it will prevent the function from throwing an error if the account
   * deletion fails.
   * @returns a Promise that resolves to a number, which represents the number of affected rows after
   * deleting an account by UUID.
   */
  async deleteAccountByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const event: EventModule.types.IEvent | null = await this.eventService.getEventByOrganizerUuid(uuid)
    if (!event) throw new EventModule.errors.EventNotFoundError('Event does not exist')

    await this.eventService.deleteEventByUuid(event.uuid)

    const affectedRows: number = await this.accountRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadAccountDeletionDataError('Failed to delete account - 0 rows affected')
    }
    return affectedRows
  }
}

export default AccountService
