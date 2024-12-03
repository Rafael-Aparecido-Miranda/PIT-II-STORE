import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersRepository } from 'src/domain/users/users.repository';
import { TokenService } from 'src/infra/token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly usersRepository: UsersRepository,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded: { id: string; message?: string } =
      this.tokenService.verifyToken(token);

    if (!decoded?.id) {
      throw new UnauthorizedException(decoded?.message);
    }

    const cacheKey = `account-${decoded.id}`;

    const cachedAccount = await this.cacheService.get(cacheKey);

    if (cachedAccount) {
      request.user = cachedAccount;
      return true;
    }

    const account = await this.usersRepository.findUserById(decoded.id);

    await this.cacheService.set(cacheKey, account, { ttl: 60 });

    if (!account) {
      throw new UnauthorizedException('Account not found');
    }

    request.user = account;
    return true;
  }
}
