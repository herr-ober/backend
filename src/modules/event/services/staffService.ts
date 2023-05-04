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

  /**
   * This function generates a JWT token for a staff member based on their authentication code and
   * role.
   * @param {IAuthCodeData} data - The `data` parameter is an object that contains the authentication
   * code data. It should have a `code` property that represents the authentication code that the staff
   * member is trying to use to authenticate.
   * @returns An object containing the authenticated staff member and a token generated for them. The
   * object has the shape `{ staff: IStaff, token: string }`.
   */
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

  /**
   * This function updates staff data by UUID and returns the number of affected rows.
   * @param {string} uuid - A string representing the unique identifier of a staff member.
   * @param {IUpdateEventData} data - The `data` parameter is an object of type `IUpdateEventData`
   * which contains the updated data for a staff member. It is used to update the staff member's
   * information in the database.
   * @returns an array of numbers, which represent the number of affected rows after updating the staff
   * data.
   */
  async updateStaffByUuid(uuid: string, data: IUpdateEventData): Promise<number[]> {
    const affectedRows: number[] = await this.staffRepo.updateByUuid(uuid, data)
    if (!affectedRows[0]) {
      throw new BadStaffUpdateDataError('Failed to update staff - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes a staff member by their UUID and returns the number of affected rows,
   * throwing an error if no rows were affected and suppressError is false.
   * @param {string} uuid - A string representing the unique identifier of the staff member to be
   * deleted.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * errors. If set to true, errors will not be thrown and the function will return a value of -1 if
   * the deletion fails. If set to false (default), errors will be thrown if the deletion fails.
   * @returns a Promise that resolves to a number, which represents the number of rows affected by the
   * deletion operation.
   */
  async deleteStaffByUuid(uuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.staffRepo.deleteByUuid(uuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete staff - 0 rows affected')
    }
    return affectedRows
  }

  /**
   * This function deletes all staff associated with a given event UUID and returns the number of
   * affected rows, throwing an error if no rows were affected and suppressError is false.
   * @param {string} eventUuid - A string representing the unique identifier of an event.
   * @param {boolean} [suppressError=false] - A boolean flag that determines whether or not to suppress
   * the error if no rows were affected by the deletion. If set to true, the function will not throw an
   * error if no rows were deleted. If set to false (default), the function will throw a
   * `BadStaffDeletionDataError` if
   * @returns a Promise that resolves to a number representing the number of rows affected by the
   * deletion operation.
   */
  async deleteAllStaffByEventUuid(eventUuid: string, suppressError: boolean = false): Promise<number> {
    const affectedRows: number = await this.staffRepo.deleteAllByEventUuid(eventUuid)
    if (affectedRows < 0 && !suppressError) {
      throw new BadStaffDeletionDataError('Failed to delete staff - 0 rows affected')
    }
    return affectedRows
  }
}

export default StaffService
