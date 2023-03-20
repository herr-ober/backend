import { IDatabaseModel } from '../../../common/interfaces'
import { StaffRole } from '../enums'

export interface IStaff extends IDatabaseModel {
  uuid: string
  eventUuid: string
  name: string
  role: StaffRole
  code: string
}
