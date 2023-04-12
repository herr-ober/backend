/* eslint-disable no-unused-vars */
enum StaffRole {
  WAITER = 'waiter',
  KITCHEN = 'kitchen'
}

enum OrderStatus {
  NEW = 'new',
  PREPARATION = 'preparation',
  COMPLETED = 'completed'
}

enum OrderPositionStatus {
  WAITING = 'waiting',
  READY = 'ready',
  DELIVERED = 'delivered'
}

export { StaffRole, OrderStatus, OrderPositionStatus }
