import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { container } from '../../modules/dependencyContainer'
import * as AccountModule from '../../modules/account'
import * as EventModule from '../../modules/event'
import { asString } from '../../common/helpers/dataHelper'

const accountService: AccountModule.interfaces.IAccountService = container.get(AccountModule.DI_TYPES.AccountService)

async function createAccount(req: Request, res: Response, next: NextFunction) {
  const email: string = req.body.email
  const name: string = req.body.name
  const password: string = req.body.password

  return accountService
    .createAccount({ email, name, password })
    .then((account: AccountModule.types.IAccount) => {
      return res.status(201).json({
        uuid: account.uuid,
        email: account.email,
        name: account.name
      })
    })
    .catch((error: Error) => {
      if (error instanceof AccountModule.errors.BadAccountCreationDataError) {
        next(error)
      } else {
        logger.error('Account creation error', { error })
        throw new InternalError('Failed to create account')
      }
    })
}

async function getAccount(req: Request, res: Response, next: NextFunction) {
  const uuid: string = asString(req.auth!.uuid)

  return accountService
    .getAccountByUuid(uuid)
    .then((account: AccountModule.types.IAccount | null) => {
      if (!account) throw new AccountModule.errors.AccountNotFoundError('Account does not exist')

      return res.status(200).json({ uuid: account.uuid, email: account.email, name: account.name })
    })
    .catch((error: Error) => {
      if (error instanceof AccountModule.errors.AccountNotFoundError) {
        next(error)
      } else {
        logger.error('Account retrieval error', { error })
        throw new InternalError('Failed to retrieve account')
      }
    })
}

async function authPassword(req: Request, res: Response, next: NextFunction) {
  const email: string = req.body.email
  const password: string = req.body.password

  return accountService
    .authPassword({ email, password })
    .then((result: { token: string; account: AccountModule.types.IAccount }) => {
      return res.status(200).json({ token: result.token, accountUuid: result.account.uuid })
    })
    .catch((error: Error) => {
      if (error instanceof AccountModule.errors.InvalidAuthPasswordDataError) {
        next(error)
      } else {
        logger.error('Password auth error', { error })
        throw new InternalError('Failed to authenticate by password')
      }
    })
}

async function updateAccount(req: Request, res: Response, next: NextFunction) {
  const uuid: string = asString(req.auth!.uuid)
  const updates: object = req.body.updates

  return accountService
    .updateAccountByUuid(uuid, updates)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof AccountModule.errors.BadAccountUpdateDataError) {
        next(error)
      } else {
        logger.error('Account update error', { error })
        throw new InternalError('Failed to update account')
      }
    })
}

async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  const uuid: string = asString(req.auth!.uuid)

  return accountService
    .deleteAccountByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (
        error instanceof AccountModule.errors.BadAccountDeletionDataError ||
        error instanceof EventModule.errors.EventNotFoundError
      ) {
        next(error)
      } else {
        logger.error('Account deletion error', { error })
        throw new InternalError('Failed to delete account')
      }
    })
}

export default {
  createAccount,
  getAccount,
  authPassword,
  updateAccount,
  deleteAccount
}
