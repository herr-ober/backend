import { IAuthCodeData, ICreateStaffData, IStaff, IUpdateEventData } from '../types'
import { IStaffRepo } from './IStaffRepo'

export interface IStaffService {
  createStaff(data: ICreateStaffData): Promise<IStaff>
  authStaffCode(data: IAuthCodeData): Promise<string>
  getStaffByUuid(uuid: string): Promise<IStaff | null>
  getStaffByCode(code: string): Promise<IStaff | null>
  getAllStaffByEventUuid(eventUuid: string): Promise<IStaff[]>
  updateStaffByUuid(uuid: string, data: IUpdateEventData): Promise<number[]>
  deleteStaffByUuid(uuid: string, suppressError?: boolean): Promise<number>
}
