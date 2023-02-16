import { IsInt, IsNotEmpty, Max, Min, IsString } from 'class-validator';

export class PlayGameMessageDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  chosenNumber: number;
}
