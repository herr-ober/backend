import { IDatabaseModel } from '../../../common/interfaces'

export interface IAccount extends IDatabaseModel {
  uuid: string
  email: string
  name: string
  passwordHash: string
}
