import { IsNotEmpty, IsString } from 'class-validator';

export class StartGameMessageDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
