import { StaffRole } from '../enums'

export interface IGetStaff {
  uuid: string
  eventUuid: string
  name: string
  role: StaffRole
  token: string
}
