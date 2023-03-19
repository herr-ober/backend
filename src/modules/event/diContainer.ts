import { container } from '../dependencyContainer'
import { DI_TYPES } from './diTypes'

// binding module injectable things to global DI container
import { IEventRepo, IEventService } from './interfaces'
import EventRepo from './repos/eventRepo'
import EventService from './services/eventService'

// we bind both private and public services as well as Repos to the global container
// but exposing only PUBLIC_DI_TYPES in the index.ts file makes these things non accessible from outside
container.bind<IEventRepo>(DI_TYPES.EventRepo).to(EventRepo)
container.bind<IEventService>(DI_TYPES.EventService).to(EventService)

export default container
