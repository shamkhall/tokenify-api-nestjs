import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenGuard } from '../common/guards/auth/refresh-token.guard';
import { GetCurrentUser } from '../common/decorators/users/get-current-user.decorator';
import { GetSessionIdDto } from './dto/get-session-id.dto';
import { Request } from 'express';
import { Public } from '../common/decorators/users/public.decorator';

@ApiTags('auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'User successfully logged in.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBody({ description: 'User login.', type: LoginDto })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ip = req['ip'];
    const deviceParams = this.authService.getDeviceParams(
      userAgent,
      loginDto.imei,
    );
    return await this.authService.login(loginDto, deviceParams, ip);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  @ApiOkResponse({ description: 'Tokens are successfully refreshed.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetSessionIdDto })
  async refreshTokens(
    @GetCurrentUser() user,
    @Body() getSessionId: GetSessionIdDto,
  ) {
    return await this.authService.refreshTokens(
      getSessionId.sessionId,
      user.refreshToken,
      user.username,
    );
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @ApiOkResponse({ description: 'User logout.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: GetSessionIdDto })
  async logout(@GetCurrentUser() user, @Body() getSessionId: GetSessionIdDto) {
    await this.authService.logout(
      getSessionId.sessionId
    );
    return {
      status: HttpStatus.OK,
      message: 'User is logged out',
    }
  }
}
