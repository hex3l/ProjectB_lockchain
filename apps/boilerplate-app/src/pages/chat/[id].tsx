/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Box, Button, Container, Paper, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

import { MessageDto } from 'dto/MessageDto';
import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const backendCall = useBackendCall();
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  const [orderID, setOrderID] = useState<string | undefined>(undefined);
  const [messageList, setMessageList] = useState<Array<MessageDto>>([]);
  const [update, setUpdate] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState<string>('');

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

  return (
    <Fragment>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[250px] flex flex-col text-center justify-center items-center">
            <Paper className="max-w-[700px] p-5 mt-[27px] flex flex-col md:flex-row gap-3 shadow-2xl z-[1000]"></Paper>
          </Box>
        </Container>
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
            <div className="w-full flex justify-center text-[10px]">Start of chat with 0xh19fb18hd18h9</div>
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
              <Button onClick={() => sendMessage()} className="btn btn-primary">
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
