import { NextFunction, Request, Response } from 'express'
import * as jose from 'jose'
import { verifyToken } from '../../common/util/tokenUtil'
import { UnauthorizedError } from '../../errors'
import { checkAuthorizationHeader } from '../../common/helpers/headerHelper'
import { TokenIssuer } from '../../common/enums'
import * as AccountModule from '../../modules/account'
import * as EventModule from '../../modules/event'
import { container } from '../../modules/dependencyContainer'

const accountService: AccountModule.interfaces.IAccountService = container.get(AccountModule.DI_TYPES.AccountService)
const staffService: EventModule.interfaces.IStaffService = container.get(EventModule.DI_TYPES.StaffService)

async function isAuthenticated(allowedIssuers: TokenIssuer[], req: Request, res: Response, next: NextFunction) {
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
      const account: AccountModule.types.IAccount | null = await accountService.getAccountByUuid(uuid)
      if (!account) return next(new UnauthorizedError('Invalid token'))

      if (!allowedIssuers.includes(payload.iss!)) {
        return next(new UnauthorizedError('Issuer not allowed for this route'))
      }

      req.auth.issuer = TokenIssuer.ACCOUNT
      break
    }
    case TokenIssuer.KITCHEN: {
      const staff: EventModule.types.IStaff | null = await staffService.getStaffByUuid(uuid)
      if (!staff) return next(new UnauthorizedError('Invalid token'))

      if (!allowedIssuers.includes(payload.iss!)) {
        return next(new UnauthorizedError('Issuer not allowed for this route'))
      }

      req.auth.issuer = TokenIssuer.KITCHEN
      break
    }
    case TokenIssuer.WAITER: {
      const staff: EventModule.types.IStaff | null = await staffService.getStaffByUuid(uuid)
      if (!staff) return next(new UnauthorizedError('Invalid token'))

      if (!allowedIssuers.includes(payload.iss!)) {
        return next(new UnauthorizedError('Issuer not allowed for this route'))
      }

      req.auth.issuer = TokenIssuer.WAITER
      break
    }
    default: {
      return next(new UnauthorizedError('Unknown issuer'))
    }
  }
  next()
}

export { isAuthenticated }
