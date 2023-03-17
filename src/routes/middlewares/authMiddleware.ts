import { NextFunction, Request, Response } from 'express'
import * as jose from 'jose'
import { verifyToken } from '../../common/util/tokenUtil'
import { UnauthorizedError } from '../../errors'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'
import { TokenIssuer } from '../../common/enums'
import * as AccountModule from '../../modules/account'
import { container } from '../../modules/dependencyContainer'

const accountService: AccountModule.interfaces.IAccountService = container.get(
  AccountModule.DI_TYPES.AccountService
)

async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token: string | null = checkAuthorizationHeader(req)
  if (!token) return next(new UnauthorizedError('Invalid token'))

  const payload: jose.JWTPayload = await verifyToken(token)
  if (!payload) return next(new UnauthorizedError('Invalid token'))

  const uuid: string = payload.sub!
  req.auth = {
    uuid,
    issuer: undefined
  }

  switch (payload.iss!) {
    case TokenIssuer.ACCOUNT: {
      const account: AccountModule.types.IAccount | null =
        await accountService.getAccountByUuid(uuid)
      if (!account) return next(new UnauthorizedError('Invalid token'))

      req.auth.issuer = TokenIssuer.ACCOUNT
      break
    }
    case TokenIssuer.STAFF: {
      // TODO: Handle staff token
      break
    }
    default: {
      return next(new UnauthorizedError('Unknown issuer'))
    }
  }
  next()
}

export { isAuthenticated }
