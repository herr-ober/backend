import { IDatabaseModel } from '../../../common/interfaces'

export interface IEvent extends IDatabaseModel {
  uuid: string
  organizerUuid: string
  name: string
  location: string
  date: Date
}
