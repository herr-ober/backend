import { DataTypes, Sequelize } from 'sequelize'
import glob from 'glob'
import path from 'path'
import { asNumber, asString } from '../common/helpers/dataHelper'

const database: any = {}

const databaseName: string = asString(process.env.DB_DATABASE)
const host: string = asString(process.env.DB_HOST)
const port: number = asNumber(process.env.DB_PORT)
const username: string = asString(process.env.DB_USERNAME)
const password: string = asString(process.env.DB_PASSWORD)
const maxConnectionsPerPool: number = asNumber(process.env.DB_MAX_CONNECTIONS_PER_POOL)
const dbSlowQueryThreshold: number = asNumber(process.env.DB_SLOW_QUERY_THRESHOLD)

const sequelize: Sequelize = new Sequelize(databaseName, username, password, {
  dialect: 'mysql',
  host,
  port,
  pool: {
    max: maxConnectionsPerPool,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  benchmark: true, // passes the query execution time as second arg to logging method
  logging: (queryString, execTimeMs) => {
    if (asNumber(execTimeMs) > dbSlowQueryThreshold) {
      logger.warn(`Slow sequelize query ${execTimeMs}ms`, {
        queryString
      })
    }
  }
})

const modelFiles = glob.sync(path.join(__dirname, '**', '*Model.*s').replaceAll(/\\/g, '/'))

/* This code iterates over an array of file paths (`modelFiles`) and requires each file as a module. It
then checks if the module is a function or a default export and calls it with the `sequelize` and
`DataTypes` objects as arguments to create a model. The created model is then added to the
`database` object with its name as the key. This code is dynamically loading all the model files in
the current directory and its subdirectories and adding them to the `database` object. */
modelFiles.forEach((file: string) => {
  // since `modelFiles` and consequently `files` don't depend on user input, we can safely require these dynamic files
  const module: any = require(file)
  const factory: any = typeof module === 'function' ? module : module.default
  const model: any = factory(sequelize, DataTypes)
  database[model.name] = model
})

/* This code is iterating over all the keys (model names) in the `database` object and checking if the
corresponding model has an `associate` function. If it does, it calls the `associate` function with
the `database` object as an argument. This is a common pattern in Sequelize where models can define
associations with other models using the `associate` function. By calling this function for each
model, the associations between models are established in the `database` object. */
Object.keys(database).forEach((modelName) => {
  if (database[modelName].associate) {
    database[modelName].associate(database)
  }
})

database.sequelize = sequelize
database.Sequelize = Sequelize

export default database
