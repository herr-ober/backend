import { Request, Response, NextFunction } from 'express'
import { InternalError } from '../../errors'
import { container } from '../../modules/dependencyContainer'
import * as AccountModule from '../../modules/account'

const accountService: AccountModule.interfaces.IAccountService = container.get(
  AccountModule.DI_TYPES.AccountService
)

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
      logger.error('Account creation error', { error })
      throw new InternalError('Failed to create account')
    })
}

async function updateAccount(req: Request, res: Response, next: NextFunction) {
  const uuid: string = req.body.uuid
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
  const uuid: string = req.body.uuid

  return accountService
    .deleteAccountByUuid(uuid)
    .then(() => {
      return res.status(204).send()
    })
    .catch((error: Error) => {
      if (error instanceof AccountModule.errors.BadAccountDeletionDataError) {
        next(error)
      } else {
        logger.error('Account deletion error', { error })
        throw new InternalError('Failed to delete account')
      }
    })
}

export default {
  createAccount,
  updateAccount,
  deleteAccount
}
