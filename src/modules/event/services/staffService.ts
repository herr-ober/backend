import { inject, injectable } from 'inversify'
import { DI_TYPES } from '../diTypes'
import { BadStaffUpdateDataError, BadStaffDeletionDataError } from '../errors'
import { IStaffRepo, IStaffService } from '../interfaces'
import { ICreateStaffData, IStaff, IGetStaff, IUpdateEventData, IAuthCodeData } from '../types'
import * as jose from 'jose'
import { addTime } from '../../../common/helpers/dateHelper'
import { generateToken } from '../../../common/util/tokenUtil'
import { TokenIssuer } from '../../../common/enums'
import { InvalidAuthCodeDataError } from '../errors/InvalidAuthCodeDataError'
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

  async authStaffCode(data: IAuthCodeData): Promise<IGetStaff> {
    const staff: IStaff | null = await this.getStaffByCode(data.code)
    if (!staff) throw new InvalidAuthCodeDataError('Code is not assigned to a staff')

    switch (staff.role) {
      case StaffRole.WAITER: {
        const payload: jose.JWTPayload = {
          iss: TokenIssuer.WAITER,
          sub: staff.uuid,
          exp: addTime('1d').getTime()
        }
        return {
          uuid: staff.uuid,
          eventUuid: staff.eventUuid,
          name: staff.name,
          role: staff.role,
          token: await generateToken(payload)
        }
      }
      case StaffRole.KITCHEN: {
        const payload: jose.JWTPayload = {
          iss: TokenIssuer.KITCHEN,
          sub: staff.uuid,
          exp: addTime('1d').getTime()
        }
        return {
          uuid: staff.uuid,
          eventUuid: staff.eventUuid,
          name: staff.name,
          role: staff.role,
          token: await generateToken(payload)
        }
      }
      default: {
        throw new Error('Invalid role name')
      }
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
