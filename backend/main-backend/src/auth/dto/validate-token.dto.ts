import { IsString, IsEthereumAddress } from 'class-validator';

export class ValidateTokenDto {
  // Match only valid ethereum addresses
  @IsEthereumAddress({
    message: 'Address is not a valid Ethereum address',
  })
  address: string;

  @IsString()
  signedToken: string;
}
