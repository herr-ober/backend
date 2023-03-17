/* eslint-disable no-unused-vars */

import { TokenIssuer } from '../../common/enums'

declare global {
  namespace Express {
    export interface Request {
      auth?: {
        issuer?: TokenIssuer
        uuid?: string
      }
    }
  }
}

export {}
