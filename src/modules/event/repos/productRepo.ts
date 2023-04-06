import { injectable } from 'inversify'
import database from '../../databaseModels'
import { IProductRepo } from '../interfaces'
import { ICreateProductData, IProduct } from '../types'

@injectable()
class ProductRepo implements IProductRepo {
  /**
   * It creates a new product in the database
   * @param {ICreateProductData} data - ICreateProductData
   * @returns The product that was created.
   */
  async create(data: ICreateProductData): Promise<IProduct> {
    return database.Product.create(data)
  }

  /**
   * It returns a product that matches the criteria
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns A promise that resolves to a Product instance or null.
   */
  async getOneByCriteria(criteria: object, scopes?: string[] | false): Promise<IProduct | null> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Product.scope(definedScopes).findOne(parameters)
    }
    return database.Product.unscoped().findOne(parameters)
  }

  async getByUuid(uuid: string, scopes?: string[]): Promise<IProduct | null> {
    return this.getOneByCriteria({ uuid }, scopes)
  }

  /**
   * It returns a list of products that match the criteria
   * @param {object} criteria - object - The criteria to search for.
   * @param {string[] | false} [scopes] - An array of scopes to apply to the query.
   * @returns An array of products
   */
  async getManyByCriteria(criteria: object, scopes?: string[] | false): Promise<IProduct[]> {
    const definedScopes = scopes || (scopes === false ? false : ['defaultScope'])
    const parameters: object = {
      where: criteria
    }
    if (definedScopes) {
      return database.Product.scope(definedScopes).findAll(parameters)
    }
    return database.Product.unscoped().findAll(parameters)
  }

  async getAllByEventUuid(eventUuid: string, scopes?: string[]): Promise<IProduct[]> {
    return this.getManyByCriteria({ eventUuid }, scopes)
  }

  async getAllByCategoryUuid(eventUuid: string, categoryUuid: string, scopes: string[]): Promise<IProduct[]> {
    return this.getManyByCriteria({ eventUuid, categoryUuid }, scopes)
  }

  /**
   * It updates the database with the given updates, where the criteria is met
   * @param {object} criteria - object - The criteria to find the product(s) to update.
   * @param {object} updates - object - The object containing the updated values.
   * @returns The number of rows affected by the update.
   */
  async update(criteria: object, updates: object): Promise<number[]> {
    return database.Product.update(updates, {
      where: criteria
    })
  }

  /**
   * It deletes a product from the database
   * @param {object} criteria - object - This is the criteria that you want to use to delete the
   * record.
   * @returns The number of rows deleted.
   */
  async delete(criteria: object): Promise<number> {
    return database.Product.destroy({
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

export default ProductRepo
