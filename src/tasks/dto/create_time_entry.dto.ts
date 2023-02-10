import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTimeEntryDto {
  @IsNotEmpty()
  @IsNumber()
  taskId: number;

  @IsNotEmpty()
  @IsDateString()
  start: string;

  @IsNotEmpty()
  @IsDateString()
  end: string;
}
