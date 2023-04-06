import { ICreateOrderPositionData } from './ICreateOrderPositionData'

export interface ICreateOrderData {
  eventUuid: string
  staffUuid: string
  tableNumber: number
  positions: ICreateOrderPositionData[]
}
