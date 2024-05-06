import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';

@Module({
  imports: [],
  providers: [ContractService],
  controllers: [],
  exports: [ContractService],
})
export class ContractModule {}
