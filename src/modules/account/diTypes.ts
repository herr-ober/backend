// public services accessible outside of module scope
const PUBLIC_DI_TYPES = {
  AccountService: Symbol('AccountService')
}

const DI_TYPES = {
  ...PUBLIC_DI_TYPES,
  AccountRepo: Symbol('AccountRepo')
}

export { PUBLIC_DI_TYPES, DI_TYPES }
