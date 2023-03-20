// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  EventService: Symbol('EventService'),
  StaffService: Symbol('StaffService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  EventRepo: Symbol('EventRepo'),
  StaffRepo: Symbol('StaffRepo')
}

export { PUBLIC_DI_TYPES, DI_TYPES }
