import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from 'src/features/auth/dto/auth.dto';

export const AuthInfos = createParamDecorator(
  (_, ctx: ExecutionContext): AuthDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const appAuthInfos: AuthDto = request['user'];

    return appAuthInfos;
  },
);
