// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  EventService: Symbol('EventService'),
  StaffService: Symbol('StaffService'),
  ProductService: Symbol('ProductService'),
  TableService: Symbol('TableService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  EventRepo: Symbol('EventRepo'),
  StaffRepo: Symbol('StaffRepo'),
  CategoryRepo: Symbol('CategoryRepo'),
  ProductRepo: Symbol('ProductRepo'),
  TableRepo: Symbol('TableRepo')
}

export { PUBLIC_DI_TYPES, DI_TYPES }
