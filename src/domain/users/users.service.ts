import { Inject, Injectable } from '@nestjs/common';
import { LoginUserProps } from './interface/users.interface';
import { EncryptService } from 'src/infra/encrypt/encrypt.service';
import { TokenService } from 'src/infra/token/token.service';
import { ErrorHandlerService } from 'src/infra/error-handler/error-handler.service';
import { ErrorStatus } from 'src/infra/error-handler/error-handler.interface';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  @Inject(UsersRepository)
  private usersRepository: UsersRepository;
  @Inject(EncryptService)
  private encryptService: EncryptService;
  @Inject(TokenService)
  private tokenService: TokenService;
  @Inject(ErrorHandlerService)
  private errorHandlerService: ErrorHandlerService;

  async createUser(props: CreateUserDto) {
    const { name, email, password, username } = props;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !email?.includes('@') ||
      !username.trim()
    ) {
      this.errorHandlerService.dispatch({
        message: 'Nome ou email inválidos',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    if (!password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const existingAccount = await this.usersRepository.findUserByEmail(email);

    if (existingAccount) {
      this.errorHandlerService.dispatch({
        message: 'Email já cadastrado',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    if (!password.trim() || password.trim().length < 8) {
      this.errorHandlerService.dispatch({
        message: 'A senha deve conter no mínimo 8 caracteres',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      this.errorHandlerService.dispatch({
        message:
          'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const passwordHash = this.encryptService.generateHash(password);

    const account = await this.usersRepository.createUser({
      name,
      email,
      username,
      password: passwordHash,
    });

    if (!account) {
      this.errorHandlerService.dispatch({
        message: 'Erro ao criar a conta',
        status: ErrorStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      message: 'Conta criada com sucesso',
    };
  }

  async login({ email, password }: LoginUserProps) {
    if (!email?.trim() || !email?.includes('@')) {
      this.errorHandlerService.dispatch({
        message: 'Email inválido',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    if (!password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const account = await this.usersRepository.findUserByEmail(email);

    if (!account) {
      this.errorHandlerService.dispatch({
        message: 'Conta não encontrada',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const decryptedPassword = this.encryptService.decryptHash(account.password);

    if (decryptedPassword !== password) {
      this.errorHandlerService.dispatch({
        message: 'Senha inválida',
        status: ErrorStatus.BAD_REQUEST,
      });
    }

    const token = this.tokenService.createToken(account.id);

    return token;
  }
}
