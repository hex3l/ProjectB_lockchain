/* eslint-disable prettier/prettier */
export type OrderDto = {
  id: number;
  title: string;
  seller: string;
  buyer: string;
  status: number;
  image: string;
  description: string;
  id_listing: number;
  price: number;
  seller_confimation: boolean;
  buyer_confirmation: boolean;
};
