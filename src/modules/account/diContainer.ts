import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { IAccountRepo, IAccountService } from './interfaces'
import AccountRepo from './repos/accountRepo'
import AccountService from './services/accountService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<IAccountRepo>(DI_TYPES.AccountRepo).to(AccountRepo)
container.bind<IAccountService>(DI_TYPES.AccountService).to(AccountService)

export default container
