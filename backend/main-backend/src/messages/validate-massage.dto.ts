import { IsNumber, IsString, IsUrl, isNumber, isURL } from 'class-validator';
import { isRegExp } from 'util/types';

export class ValidateMessageDto {
  @IsString({
    message: 'message content not valid',
  })
  content: string;

  @IsNumber(
    {},
    {
      message: 'description not valid',
    },
  )
  order: number;
}
