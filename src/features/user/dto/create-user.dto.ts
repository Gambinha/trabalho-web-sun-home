import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  name: string;

  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @ApiProperty({ example: '1234' })
  password: string;
}
