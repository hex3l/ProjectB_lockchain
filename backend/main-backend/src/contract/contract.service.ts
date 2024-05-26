import { Injectable } from '@nestjs/common';
import { Address, Contract, ContractAbi, Web3 } from 'web3';
import * as dealHandlerContract from '../../truffle/build/contracts/DealHandler.json';
import { Web3Account } from 'web3-eth-accounts';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { OrderStatus } from '../order/static/order-status.enum';
import { Message } from '../messages/message.entity';

@Injectable()
export class ContractService {
  private web3: Web3;
  private account: Web3Account;
  private contract: Contract<ContractAbi>;
  private contractEvents;
  constructor(
    @InjectDataSource()
    private datasource: DataSource,
  ) {
    const provider = new Web3.providers.WebsocketProvider(process.env.ETH_NETWORK_URL);
    this.web3 = new Web3(provider);
    this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.ETH_ACCOUNT);
    this.web3.eth.defaultAccount = this.account.address;
    this.contract = new Contract(dealHandlerContract.abi, dealHandlerContract.networks[5777].address);
    this.contract.setProvider(provider);
    this.contract.defaultAccount = this.account.address;

    this.contractEvents = this.contract.events.allEvents({});
    this.contractEvents.on('data', (data) => chainEventHandler(data, this.datasource, this.web3));
    this.contractEvents.on('error', console.error);
  }

  getContractDetails() {
    return {
      contract: dealHandlerContract.networks[5777].address,
      abi: dealHandlerContract.abi,
    };
  }

  async getDeal(dealId: number): Promise<{ data: void | [] | (unknown[] & []); error: any | undefined }> {
    try {
      const result = await this.contract.methods.getDeal(dealId).call();
      return { data: result, error: undefined };
    } catch (error) {
      console.log(error);
      return { data: undefined, error };
    }
  }

  async createDeal(dealId: number, amount: number, source: string, target: string) {
    try {
      const result = await this.contract.methods
        .createDeal(dealId, this.web3.utils.toWei(amount, 'ether'), source, target)
        .send({ gas: '6721975' });
      return { data: result, error: undefined };
    } catch (error) {
      console.log(error);
      return { data: undefined, error };
    }
  }

  async discard(dealId: number) {
    try {
      const result = await this.contract.methods.discardDeal(dealId).send({ gas: '6721975' });
      return { data: result, error: undefined };
    } catch (error) {
      console.log(error);
      return { data: undefined, error };
    }
  }

  async accept(dealId: number) {
    try {
      const result = await this.contract.methods.completeAndPay(dealId).send({ gas: '6721975' });
      return { data: result, error: undefined };
    } catch (error) {
      console.log(error);
      return { data: undefined, error };
    }
  }
}

const chainEventHandler = async (event, datasource: DataSource, web3: Web3) => {
  const orderRepository = datasource.getRepository(Order);
  const messageRepository = datasource.getRepository(Message);
  const orderId = Number(event.returnValues.id);

  const order = await orderRepository.findOne({ where: { id: orderId }, relations: ['listing'] });

  switch (event.event) {
    case 'Payed':
      console.log('Payed', orderId);
      await orderRepository.update(orderId, { status: OrderStatus.ACTIVE });
      await messageRepository.save({ id_sender: order.id_creator, content: '$$$PAYED', id_order: orderId });
      return;
    case 'TargetConfirm':
      console.log('TargetConfirm', orderId);
      await orderRepository.update(orderId, { seller_confirmation: true });
      await messageRepository.save({ id_sender: order.listing.id_creator, content: '$$$CONFIRM', id_order: orderId });
      return;
    case 'SourceConfirm':
      console.log('SourceConfirm', orderId);
      await orderRepository.update(orderId, { buyer_confirmation: true });
      await messageRepository.save({ id_sender: order.id_creator, content: '$$$CONFIRM', id_order: orderId });
      return;
    case 'Confirmed':
      console.log('Confirmed', orderId);
      await orderRepository.update(orderId, { status: OrderStatus.FINALIZED, is_dispute: false });
      await messageRepository.save({ id_sender: order.id_creator, content: '$$$SUCCESS', id_order: orderId });
      return;
    case 'Reimbursed':
      console.log('Reimbursed', orderId);
      await orderRepository.update(orderId, { status: OrderStatus.REIBURSED, is_dispute: false });
      await messageRepository.save({ id_sender: order.id_creator, content: '$$$REIMBURSED', id_order: orderId });
      return;
    default:
      return;
  }
};
