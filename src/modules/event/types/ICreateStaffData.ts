import { StaffRole } from '../enums'

export interface ICreateStaffData {
  eventUuid: string
  name: string
  role: StaffRole
}
