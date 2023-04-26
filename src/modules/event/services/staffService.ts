import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { BadStaffUpdateDataError, BadStaffDeletionDataError, InvalidAuthCodeDataError } from '../errors'
import { IStaffRepo, IStaffService } from '../interfaces'
import { ICreateStaffData, IStaff, IUpdateEventData, IAuthCodeData } from '../types'
import * as jose from 'jose'
import { addTime } from '../../../common/helpers/dateHelper'
import { generateToken } from '../../../common/util/tokenUtil'
import { TokenIssuer } from '../../../common/enums'
import { StaffRole } from '../enums'

@injectable()
class StaffService implements IStaffService {
  private readonly staffRepo: IStaffRepo

  public constructor(@inject(DI_TYPES.StaffRepo) staffRepo: IStaffRepo) {
    this.staffRepo = staffRepo
  }

  async createStaff(data: ICreateStaffData): Promise<IStaff> {
    return this.staffRepo.create(data)
  }

  async authStaffCode(data: IAuthCodeData): Promise<{ staff: IStaff; token: string }> {
    const staff: IStaff | null = await this.getStaffByCode(data.code)
    if (!staff) throw new InvalidAuthCodeDataError('Code is not assigned to a staff')

    const payload: jose.JWTPayload = {
      sub: staff.uuid,
      exp: addTime('1d').getTime()
    }

    switch (staff.role) {
      case StaffRole.WAITER: {
        payload.iss = TokenIssuer.WAITER
        break
      }
      case StaffRole.KITCHEN: {
        payload.iss = TokenIssuer.KITCHEN
        break
      }
      default: {
        throw new Error('Invalid role name')
      }
    }

    return {
      staff,
      token: await generateToken(payload)
    }
  }

  async getStaffByUuid(uuid: string): Promise<IStaff | null> {
    return this.staffRepo.getByUuid(uuid)
  }

  async getStaffByCode(code: string): Promise<IStaff | null> {
    return this.staffRepo.getByCode(code)
  }

  async getAllStaffByEventUuid(eventUuid: string): Promise<IStaff[]> {
    return this.staffRepo.getAllByEventUuid(eventUuid)
  }

  async updateStaffByUuid(uuid: string, data: IUpdateEventData): Promise<number[]> {
    const affectedRows: number[] = await this.staffRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadStaffUpdateDataError('Failed to update staff - 0 rows affected')
    }
    return affectedRows
  }

  async deleteStaffByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.staffRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete staff - 0 rows affected')
    }
    return affectedRows
  }
}

export default StaffService
