export enum OrderStatus {
  PENDING = 0, // Order created on db (if an offer has been made)
  CONFIRMED = 1, // Push Order on chain (when seller accepts the offer or it is an instant buy, offer has same price as listing)
  ON_CHAIN = 2, // Event from chain confirms order creatin
  ACTIVE = 3, // Event Buyer pays out the order
  FINALIZED = 4, // Event Both have confirmed the order (or through dispute but payed to seller)
  REIBURSED = 5, // Event Seller has been reimbursed due to dispute
  REJECTED = 100, // When PNEDING is not accepted by seller
}
