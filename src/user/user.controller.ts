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

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Put('change-password')
  changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get('addresses')
  getAddresses(@Request() req) {
    return this.userService.getAddresses(req.user.userId);
  }

  @Post('addresses')
  createAddress(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.userService.createAddress(req.user.userId, createAddressDto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Request() req, @Param('id') id: string) {
    return this.userService.deleteAddress(req.user.userId, id);
  }

  @Put('addresses/:id/set-default')
  setDefaultAddress(@Request() req, @Param('id') id: string) {
    return this.userService.setDefaultAddress(req.user.userId, id);
  }
}
