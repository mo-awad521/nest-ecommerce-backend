import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async create(createDto: CreateAddressDto, userId: number) {
    const address = this.addressRepo.create({
      ...createDto,
      user: { id: userId },
    });
    return this.addressRepo.save(address);
  }

  async findAllForUser(userId: number) {
    return this.addressRepo.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(userId: number) {
    const address = await this.addressRepo.findOne({ where: { id: userId } });
    return address;
  }

  async findOneForUser(id: number, userId: number) {
    const address = await this.addressRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!address) throw new NotFoundException('Address not found');

    return address;
  }

  async update(id: number, updateDto: UpdateAddressDto, userId: number) {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) throw new NotFoundException('Address not found');

    if (address.user.id !== userId)
      throw new ForbiddenException(
        'You cannot modify an address you do not own',
      );

    Object.assign(address, updateDto);
    return this.addressRepo.save(address);
  }

  async remove(id: number, userId: number) {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) throw new NotFoundException('Address not found');

    if (address.user.id !== userId)
      throw new ForbiddenException(
        'You cannot delete an address you do not own',
      );

    await this.addressRepo.remove(address);
    return { message: 'Address deleted successfully' };
  }
}
