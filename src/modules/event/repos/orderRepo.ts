import { injectable } from 'inversify'
import { ICreateOrderData, IOrder, IUpdateOrderData } from '../types'
import database from '../../databaseModels'
import { IOrderRepo } from '../interfaces'
import { OrderStatus } from '../enums'

@injectable()
class OrderRepo implements IOrderRepo {
  /**
   * This function creates a new order in a database using the provided data.
   * @param {ICreateOrderData} data - ICreateOrderData is likely an interface or type that defines the
   * shape of the data object that is expected to be passed into the create method. It could include
   * properties such as customer information, order details, and payment information. The method
   * returns a Promise that resolves to an object of type IOrder,
   * @returns The `create` method is returning a Promise that resolves to an `IOrder` object. The
   * `IOrder` object is likely a type defined in the codebase and represents an order entity with
   * various properties such as order ID, customer information, order items, etc. The `create` method
   * is likely creating a new order record in a database using the provided `data` object and returning
   * the
   */
  async create(data: ICreateOrderData): Promise<IOrder> {
    return database.Order.create(data)
  }

  /**
   * This is an async function that retrieves a single order based on given criteria and optional
   * scopes.
   * @param {object} criteria - The criteria parameter is an object that specifies the conditions that
   * the returned order should meet. It is used to filter the orders based on certain attributes such
   * as order status, customer ID, etc.
   * @param {string[] | false} [scopes] - `scopes` is an optional parameter that can be either an array
   * of strings or a boolean value. If it is an array of strings, it represents the names of the scopes
   * that should be applied to the query. If it is `false`, no scopes will be applied. If it is not
   * provided
   * @returns a Promise that resolves to either an IOrder object or null.
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IOrder | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Order.scope(definedScopes).findOne(parameters)
    }
    return database.Order.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IOrder | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  /**
   * This function retrieves multiple orders based on given criteria and optional scopes.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that the returned orders must meet. It is used to filter the orders based on certain attributes
   * such as order status, customer ID, etc.
   * @param {string[] | false} [scopes] - `scopes` is an optional parameter that can be either an array
   * of strings or a boolean value. If it is an array of strings, it represents the names of the scopes
   * to be applied to the query. If it is `false`, no scopes will be applied. If it is not provided,
   * @returns This function returns a Promise that resolves to an array of IOrder objects that match
   * the given criteria. The function may apply additional scopes to the query if specified, or it may
   * return all matching records regardless of any defined scopes.
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IOrder[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Order.scope(definedScopes).findAll(parameters)
    }
    return database.Order.unscoped().findAll(parameters)
  }

  async getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IOrder[]> {
    return this.getManyByCriteria({ eventUuid }, scopes)
  }

  async getAllByStatus(status: OrderStatus, scopes?: string[]): Promise<IOrder[]> {
    return this.getManyByCriteria({ status }, scopes)
  }

  /**
   * This is an async function that updates orders in a database based on given criteria and returns an
   * array of updated order IDs.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that must be met for the update operation to be performed. It is used to filter the records that
   * need to be updated. The `where` clause in the SQL query is constructed based on this object.
   * @param {object} updates - The `updates` parameter is an object that contains the new values that
   * we want to update in the database. The keys of the object represent the column names in the
   * database table, and the values represent the new values that we want to set for those columns.
   * @returns The `update` method is being called on the `Order` model of the `database`, with the
   * `updates` object being passed as the first argument and the `criteria` object being passed as the
   * second argument. The method returns a Promise that resolves to an array of numbers representing
   * the number of rows affected by the update operation.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Order.update(updates, {
      where: criteria
    })
  }

  async updateByUuid(uuid: string, updates: IUpdateOrderData): Promise<number[]> {
    return this.update({ uuid }, updates)
  }

  /**
   * This function deletes orders from a database based on a given criteria and returns the number of
   * deleted orders as a promise.
   * @param {object} criteria - The `criteria` parameter is an object that specifies the conditions
   * that must be met for the database records to be deleted. It is used to construct the `WHERE`
   * clause of the SQL query that will be executed to delete the records. The properties of the
   * `criteria` object correspond to the columns of
   * @returns A Promise that resolves to a number, which represents the number of rows deleted from the
   * "Order" table in the database that match the given criteria.
   */
  async delete(criteria: object): Promise<number> {
    return database.Order.destroy({
      where: criteria
    })
  }

  async deleteByUuid(uuid: string): Promise<number> {
    return this.delete({ uuid })
  }

  async deleteAllByEventUuid(eventUuid: string): Promise<number> {
    return this.delete({ eventUuid })
  }
}

export default OrderRepo
