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
import React, { Fragment, useState, useEffect, useCallback, useContext } from 'react';
import { useAccount, useConfig, useWriteContract } from 'wagmi';

import { OrderStatus, OrderStatusFromNumber, OrderStatusName } from 'common/consts/order-status.enum';
import { MessageDto } from 'dto/MessageDto';
import { OrderDto } from 'dto/OrderDto';
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
  const [newMessage, setNewMessage] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<OrderDto>({} as OrderDto);
  const orderStatus: OrderStatus = OrderStatusFromNumber[orderInfo.status as keyof typeof OrderStatusFromNumber];
  const { writeContract } = useWriteContract();

  useEffect(() => {
    void (async () => {
      if (orderID !== undefined && update) {
        setUpdate(false);
        const result = (await backendCall(`message/${orderID}`)) as Array<MessageDto>;
        setMessageList(result.reverse());
      }
    })();
  }, [orderID, update]); // Run this effect only once when the component mounts

  useEffect(() => {
    void (async () => {
      if (orderID !== undefined) {
        const result = (await backendCall(`order/info/${orderID}`)) as OrderDto;
        setOrderInfo(result);
      }
    })();
  }, [orderID]);

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
        <Container maxWidth="xl">
          <Box className="w-full h-[300px] flex flex-col text-center justify-center items-center">
            <Paper className="max-w-[700px] p-5 mt-[8px] flex flex-col md:flex-row gap-3 shadow-2xl z-[1000] gap">
              <Box className="flex flex-col gap-5">
                <img src={orderInfo.image} alt="product" className="w-[200px] h-[200px] object-cover" />
              </Box>
              <Typography className=" md:text-[1.5rem] text-[1.5rem] leading-[4rem]">
                {orderInfo.title} <br /> {orderInfo.price} ETH <br /> State : {`${OrderStatusName[orderStatus]}`}
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
      <Box className="w-full h-[100px] flex flex-col text-center justify-center items-center">
        {orderInfo.buyer == address ? (
          orderInfo.buyer_confirmation ? (
            <Button disabled>Order recived confirmed</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => sendConfirmation()}>
              Confirm Order recipt
            </Button>
          )
        ) : orderInfo.seller_confimation ? (
          <Button disabled>Order sent</Button>
        ) : (
          <Button variant="contained" color="primary" onClick={() => sendConfirmation()}>
            Confirm Order send
          </Button>
        )}
      </Box>
      <Container maxWidth="md" className="pt-10 flex flex-col gap-5">
        <Paper className="flex flex-col gap-5 p-5">
          <Box className="flex flex-col-reverse gap-y-5 max-h-[300px] overflow-auto p-3">
            {messageList?.map(({ id, ...message }) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <Message
                key={id}
                message={message.content}
                right={message.sender.address === address}
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
      </Container>
    </Fragment>
  );
};

const Message = ({ message, timestamp, right }: { message: string; timestamp: string; right: boolean }) => {
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
