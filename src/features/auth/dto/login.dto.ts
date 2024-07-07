import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail',
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha',
    example: '1234',
  })
  password: string;
}
