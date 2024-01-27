import { IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrderVerifyDto {
  @IsNumber()
  id: number;

  @IsEthereumAddress()
  from: string;

  @IsEthereumAddress()
  to: string;
}
