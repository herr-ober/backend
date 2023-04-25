import { StaffRole } from '../enums'

export interface IGetStaff{
  uuid: string
  name: string
  role: StaffRole
  token: string
}
