import { Permission } from './permission.enum';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NestMiddleware,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    const { headers } = context.switchToHttp().getRequest();
    const request = context.switchToHttp().getRequest();
    const { authorization } = headers;
    //const request = context.switchToHttp().getRequest();
    const user = await this.authService.verify(authorization.split(' ')[1]);
    const _user = await this.usersService.findById(user.id);
    const userId = request.params.userId;
    return requiredPermissions.some(
      (permission) => _user.permissions === permission && _user.id == userId,
    );
  }
}
