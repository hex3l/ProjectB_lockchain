/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { watchContractEvent } from '@wagmi/core';
import { useRouter } from 'next/router';
import React, { Fragment, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';

import { MessageDto } from 'dto/MessageDto';
import { OrderDto } from 'dto/OrderDto';
import { OfferStatusRow } from 'modules/Listings/OfferStatusRow';
import { GlobalStateContext } from 'utils/GlobalState';
import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const { state } = useContext(GlobalStateContext);
  const { abi, contract } = state.auth;
  const backendCall = useBackendCall();
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  const [orderID, setOrderID] = useState<string | undefined>(undefined);
  const [messageList, setMessageList] = useState<Array<MessageDto>>([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [updateOrder, setUpdateOrder] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<OrderDto>({} as OrderDto);
  const { writeContract } = useWriteContract();

  useEffect(() => {
    void (async () => {
      if (orderID !== undefined && update) {
        setUpdate(false);
        const result = (await backendCall(`message/${orderID}`)) as Array<MessageDto> | undefined;
        if (result) setMessageList(result.reverse());
      }
    })();
  }, [orderID, update]); // Run this effect only once when the component mounts

  useEffect(() => {
    const pullmsg = async () => {
      if (orderID !== undefined) {
        const result = (await backendCall(`message/${orderID}`)) as Array<MessageDto> | undefined;
        if (result) setMessageList(result.reverse());
      }
    };

    const inter = setInterval(() => pullmsg(), 5000);

    return () => clearInterval(inter);
  }, [orderID, update]); // Run this effect only once when the component mounts

  useEffect(() => {
    void (async () => {
      if (orderID !== undefined) {
        const result = (await backendCall(`order/info/${orderID}`)) as OrderDto;
        setOrderInfo(result);
        setUpdateOrder(false);
      }
    })();
  }, [orderID, updateOrder]);

  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.id) {
      setOrderID(router.query.id as string);
    }
  }, [id]);

  const sendMessage = useCallback(() => {
    void (async () => {
      await backendCall(`message/${orderID}/create`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage }),
      });
      setUpdate(true);
      setNewMessage('');
    })();
  }, [orderID, newMessage]);

  const openDispute = useCallback(() => {
    void (async () => {
      await backendCall(`order/openDispute`, {
        method: 'POST',
        body: JSON.stringify({ id: orderInfo.id }),
      });
      setUpdateOrder(true);
      setNewMessage('');
    })();
  }, [orderID, orderInfo, backendCall]);

  const config = useConfig();
  useEffect(() => {
    if (contract && abi) {
      const onLogs = (logs: any) => {
        for (const log of logs) {
          console.log('Blockchain event:', log.eventName);
          switch (log.eventName) {
            case 'SourceConfirm':
              setOrderInfo({ ...orderInfo, buyer_confirmation: true });
              break;
            case 'TargetConfirm':
              setOrderInfo({ ...orderInfo, seller_confimation: true });
              break;
          }
        }
      };
      const watchConfig = {
        address: contract,
        abi,
        onLogs,
      };

      return watchContractEvent(config, watchConfig);
    }
  }, [contract, abi, id, orderInfo]);

  const sendConfirmation = useCallback(() => {
    if (contract) {
      writeContract(
        {
          abi,
          address: contract,
          functionName: orderInfo.buyer == address ? 'confirmSourceDeal' : 'confirmTargetDeal',
          args: [BigInt(orderInfo.id)],
        },
        { onError: (err) => console.error(err) },
      );
    }
  }, [abi, contract, id, writeContract, orderInfo, address]);

  return (
    <Fragment>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container fixed className="h-[300px] flex items-center justify-center">
          {orderInfo.id > 0 && (
            <Box className="relative space-y-2 z-50">
              <OfferStatusRow {...{ ...orderInfo }} hideButtons />
              <Paper className="w-full p-2 flex flex-row text-center justify-center items-center">
                {orderInfo.buyer === address && (
                  <>
                    <Box className="w-1/2">
                      {orderInfo.seller_confimation ? (
                        <Button disabled>Seller confirmed completion of order</Button>
                      ) : (
                        <Button disabled>Awaiting seller confirmation</Button>
                      )}
                    </Box>
                    <Box className="w-1/2">
                      {orderInfo.buyer_confirmation ? (
                        <Button disabled>You have confirmed reception of order</Button>
                      ) : (
                        <Button variant="contained" color="primary" onClick={() => sendConfirmation()}>
                          Mark order as recieved
                        </Button>
                      )}
                    </Box>
                  </>
                )}
                {orderInfo.buyer !== address && (
                  <>
                    {orderInfo.buyer_confirmation ? (
                      <Button disabled>Buyer confirmed reception of order</Button>
                    ) : (
                      <Button disabled>Awaiting buyer confirmation of reception</Button>
                    )}
                    {orderInfo.seller_confimation ? (
                      <Button disabled>You have confirmed completion of order</Button>
                    ) : (
                      <Button variant="contained" color="primary" onClick={() => sendConfirmation()}>
                        Mark order as completed
                      </Button>
                    )}
                  </>
                )}
              </Paper>
            </Box>
          )}
        </Container>
      </Box>

      <Container fixed className="flex flex-col gap-5 pt-5">
        <Paper className="flex flex-col gap-5 p-5">
          <Box className="flex flex-col-reverse gap-y-5 max-h-[300px] overflow-auto p-3">
            {orderInfo.buyer &&
              messageList?.map(({ id, ...message }) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                <Message
                  key={id}
                  message={message.content}
                  address={message.sender.address}
                  right={message.sender.address === address}
                  buyer={orderInfo.buyer === message.sender.address}
                  timestamp={message.created}
                />
              ))}
            <div className="w-full flex flex-col justify-center text-[13px]">
              <div className="w-full flex justify-center">Start of chat with</div>
              <div className="w-full flex justify-center text-[15px]">
                {orderInfo.buyer == address ? orderInfo.seller : orderInfo.buyer}
              </div>
            </div>
          </Box>
          <Box className="flex flex-row gap-x-5">
            <Box className="flex-1">
              <TextField
                id="message"
                label="Message"
                variant="outlined"
                fullWidth
                onChange={(ev) => setNewMessage(ev.target.value)}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    sendMessage();
                  }
                }}
                value={newMessage}
              />
            </Box>
            <Box className="flex flex-row justify-center">
              <Button variant="contained" color="primary" onClick={() => sendMessage()} className="btn btn-primary">
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
        <Button disabled={orderInfo.is_dispute} variant="contained" color="primary" onClick={() => openDispute()}>
          {orderInfo.is_dispute ? 'Dispute already opened' : 'Open Dispute'}
        </Button>
      </Container>
    </Fragment>
  );
};

const Message = ({
  message,
  address,
  timestamp,
  right,
  buyer,
}: {
  message: string;
  address: string;
  timestamp: string;
  right: boolean;
  buyer: boolean;
}) => {
  const orderStateChange = useMemo(() => {
    if (buyer) {
      // if the message is from the buyer
      const buyerPron = right ? 'You have' : 'The buyer has';
      switch (message) {
        case '$$$PAYED':
          return ['Order payed', `${buyerPron} have payed the order`];
        case '$$$CONFIRM':
          return ['Confirmed', `${buyerPron} confirmed reception of the order`];
        case '$$$REIMBURSED':
          return ['Order has been reimbursed', `${buyerPron} been reimbursed`];
        default:
          return undefined;
      }
    }
    // If the message is from the seller
    const sellerPron = right ? 'You have' : 'The seller has';
    switch (message) {
      case '$$$CONFIRM':
        return ['Confirmed', `${sellerPron} confirmed the order`];
      case '$$$SUCCESS':
        return ['Order completed', `The order has been completed. ${sellerPron} been payed`];
      default:
        return undefined;
    }
  }, [message]);

  if (orderStateChange) {
    return (
      <Box className={`flex w-full `}>
        <Box
          className={`flex flex-col w-full ${
            right ? 'bg-green-600 text-end' : 'bg-yellow-700'
          } bg-opacity-10 rounded-lg p-3 justify-center items-center`}
        >
          <Typography variant="h5" className="text-[#ffeb3b]">
            {orderStateChange[0]}
          </Typography>
          <Box className="w-auto text-[8px]">
            {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}
          </Box>
          <Box className="">{address}</Box>
          <Box className="">{orderStateChange[1]}</Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`flex ${right ? 'justify-end' : 'justify-start'}`}>
      <Box className={`flex flex-col`}>
        <Box className={``}>
          <Box className={`w-auto rounded-lg ${right ? 'bg-green-600 text-end' : 'bg-yellow-700'} p-2`}>{message}</Box>
        </Box>
        <Box className="w-auto text-[8px]">
          {new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;
