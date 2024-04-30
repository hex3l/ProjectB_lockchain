export type ListingDto = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  status: number;
  category: { id: number; name: string };
  updated: Date;
  creator: {
    address: string;
    created: Date;
    rating: number;
  };
  favorite: boolean;
};
