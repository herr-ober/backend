import { ICreateStaffData, IStaff, IUpdateStaffData } from '../types'

export interface IStaffRepo {
  create(data: ICreateStaffData): Promise<IStaff>
  getByUuid(uuid: string, scopes?: string[]): Promise<IStaff | null>
  getByCode(code: string, scopes?: string[]): Promise<IStaff | null>
  getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IStaff[]>
  updateByUuid(uuid: string, updates: IUpdateStaffData): Promise<number[]>
  deleteByUuid(uuid: string): Promise<number>
  deleteByEventUuid(eventUuid: string): Promise<number>
}
