import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsEthereumAddress,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
  isNumber,
  isURL,
} from 'class-validator';

export class OrdersFindDto {
  @IsBooleanString()
  source: boolean;

  @IsBooleanString()
  target: boolean;

  @IsNumberString()
  status: Array<number>; //perche' array?

  @IsNumberString()
  take: number;

  @IsNumberString()
  page: number;
}
