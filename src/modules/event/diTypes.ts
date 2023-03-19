// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  EventService: Symbol('EventService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  EventRepo: Symbol('EventRepo')
}

export { PUBLIC_DI_TYPES, DI_TYPES }
