import { IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrderIdDto {
  @IsNumber()
  id: number;
}
