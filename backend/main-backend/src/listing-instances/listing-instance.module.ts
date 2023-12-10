import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListingInstanceController } from './listing-instance.controller';
import { ListingInstance } from './listing-instance.entity';
import { ListingInstanceService } from './listing-instance.service';

@Module({
  imports: [TypeOrmModule.forFeature([ListingInstance])],
  providers: [ListingInstanceService],
  controllers: [ListingInstanceController],
  exports: [ListingInstanceService],
})
export class ListingIstanceModule {}
