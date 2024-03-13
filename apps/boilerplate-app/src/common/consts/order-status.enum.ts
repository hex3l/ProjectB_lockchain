export const OrderStatus = {
  '0': 'pending', // Order created on db (if an offer has been made)
  '1': 'confirmed', // Push Order on chain (when seller accepts the offer or it is an instant buy, offer has same price as listing)
  '2': 'on chain', // Event from chain confirms order creatin
  '3': 'active', // Event Buyer pays out the order
  '4': 'finalized', // Event Both have confirmed the order (or through dispute but payed to seller)
  '5': 'reimbursed', // Event Seller has been reimbursed due to dispute
  '100': 'rehected', // When PNEDING is not accepted by seller
};
