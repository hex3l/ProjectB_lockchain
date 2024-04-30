import { Listing } from '../listing.entity';

export class ListingWithFavoriteDto extends Listing {
  favorite: boolean;
}
