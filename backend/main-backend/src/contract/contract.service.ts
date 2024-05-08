import { Injectable } from '@nestjs/common';
import { Address, Contract, ContractAbi, Web3 } from 'web3';
import * as dealHandlerContract from '../../truffle/build/contracts/DealHandler.json';
import { Web3Account } from 'web3-eth-accounts';

@Injectable()
export class ContractService {
  private web3: Web3;
  private account: Web3Account;
  private contract: Contract<ContractAbi>;
  constructor() {
    const provider = new Web3.providers.HttpProvider(process.env.ETH_NETWORK_URL);
    this.web3 = new Web3(provider);
    this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.ETH_ACCOUNT);
    this.web3.eth.defaultAccount = this.account.address;
    this.contract = new Contract(dealHandlerContract.abi, dealHandlerContract.networks[5777].address);
    this.contract.setProvider(provider);
    this.contract.defaultAccount = this.account.address;
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
        .send({ value: '1', gas: '6721975' });
      return { data: result, error: undefined };
    } catch (error) {
      console.log(error);
      return { data: undefined, error };
    }
  }
}