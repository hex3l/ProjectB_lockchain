import { IsEthereumAddress, IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';

export class OrderStatusChangeDto {
  id: number;
  status: number;
  is_dispute: boolean;
}
