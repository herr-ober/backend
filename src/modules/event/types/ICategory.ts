import { IDatabaseModel } from '../../../common/interfaces'

export interface ICategory extends IDatabaseModel {
  uuid: string
  name: string
  iconName: string
}
