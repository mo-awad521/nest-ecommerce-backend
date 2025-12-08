// src/modules/addresses/addresses.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.addressesService.create(createAddressDto, user.sub);
  }

  @Get()
  @ResponseMessage('All Addresses')
  findAll(@CurrentUser() user: JwtPayload) {
    return this.addressesService.findAllForUser(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.addressesService.findOneForUser(+id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.addressesService.update(+id, updateAddressDto, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.addressesService.remove(+id, user.sub);
  }
}
