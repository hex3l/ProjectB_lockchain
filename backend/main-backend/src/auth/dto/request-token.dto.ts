import { IsEthereumAddress } from 'class-validator';
import { isRegExp } from 'util/types';

export class RetriveAccessTokenDto {
  @IsEthereumAddress({
    message: 'Address is not a valid Ethereum address',
  })
  readonly address: string;
}
