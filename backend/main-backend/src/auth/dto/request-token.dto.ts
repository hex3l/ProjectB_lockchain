import { IsEthereumAddress } from 'class-validator';

export class RetriveAccessTokenDto {
  @IsEthereumAddress({
    message: 'Address is not a valid Ethereum address',
  })
  readonly address: string;
}
