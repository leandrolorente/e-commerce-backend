import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
} from './dto/user.dto';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('change-password')
  changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get('addresses')
  getAddresses(@Request() req: RequestWithUser) {
    return this.userService.getAddresses(req.user.userId);
  }

  @Post('addresses')
  createAddress(
    @Request() req: RequestWithUser,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.userService.createAddress(req.user.userId, createAddressDto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.userService.deleteAddress(req.user.userId, id);
  }

  @Put('addresses/:id/default')
  setDefaultAddress(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.userService.setDefaultAddress(req.user.userId, id);
  }
}
