export enum OrderStatus {
  PENDING = 0,
  CONFIRMED = 1,
  ON_CHAIN = 2,
  ACTIVE = 3,
  FINALIZED = 4,
  REIMBURSED = 5,
  REVIEWED = 6,
  REJECTED = 100,
}
export const OrderStatusFromNumber = {
  0: OrderStatus.PENDING,
  1: OrderStatus.CONFIRMED,
  2: OrderStatus.ON_CHAIN,
  3: OrderStatus.ACTIVE,
  4: OrderStatus.FINALIZED,
  5: OrderStatus.REIMBURSED,
  6: OrderStatus.REVIEWED,
  100: OrderStatus.REJECTED,
};
export const OrderStatusName = {
  [OrderStatus.PENDING]: 'pending', // Order created on db (if an offer has been made)
  [OrderStatus.CONFIRMED]: 'confirmed', // Push Order on chain (when seller accepts the offer or it is an instant buy, offer has same price as listing)
  [OrderStatus.ON_CHAIN]: 'waiting for payment', // Event from chain confirms order creatin
  [OrderStatus.ACTIVE]: 'payed', // Event Buyer pays out the order
  [OrderStatus.FINALIZED]: 'finalized', // Event Both have confirmed the order (or through dispute but payed to seller)
  [OrderStatus.REIMBURSED]: 'reimbursed', // Event Seller has been reimbursed due to dispute
  [OrderStatus.REVIEWED]: 'reviewed', // review left
  [OrderStatus.REJECTED]: 'rejected', // When PNEDING is not accepted by seller
};

export const OrderStatusColors = {
  [OrderStatus.PENDING]: 'default', // Order created on db (if an offer has been made)
  [OrderStatus.CONFIRMED]: 'warning', // Push Order on chain (when seller accepts the offer or it is an instant buy, offer has same price as listing)
  [OrderStatus.ON_CHAIN]: 'warning', // Event from chain confirms order creatin
  [OrderStatus.ACTIVE]: 'success', // Event Buyer pays out the order
  [OrderStatus.FINALIZED]: 'success', // Event Both have confirmed the order (or through dispute but payed to seller)
  [OrderStatus.REIMBURSED]: 'error', // Event Seller has been reimbursed due to dispute
  [OrderStatus.REVIEWED]: 'success', // review left
  [OrderStatus.REJECTED]: 'error', // When PNEDING is not accepted by seller
};
