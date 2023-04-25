import { ICreateOrderPositionData } from './ICreateOrderPositionData'

export interface ICreateOrderData {
  eventUuid: string
  staffUuid: string
  tableUuid: string
  positions: ICreateOrderPositionData[]
  notes: string
}
