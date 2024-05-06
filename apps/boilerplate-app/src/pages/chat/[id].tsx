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

import { MessageDto } from 'dto/MessageDto';
import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const backendCall = useBackendCall();
  const router = useRouter();
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
        setMessageList(result);
        console.log(orderID);
      }
    })();
  }, [orderID, update]); // Run this effect only once when the component mounts

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      setOrderID(id as string);
    }
  }, [id]);

  const sendMessage = useCallback(() => {
    void (async () => {
      const result = (await backendCall(`message/${orderID}/create`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage }),
      })) as Array<MessageDto>;
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
      <Container maxWidth="xl" className="pt-10 flex flex-col gap-5">
        <Box className="flex flex-col md:flex-row"></Box>
        <Box className="flex flex-row gap-5">
          <Box className="h-full flex-col" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box className="w-[250px]" />
          </Box>
          <Box className="flex flex-wrap flex-row gap-5 justify-evenly">
            {messageList.map(({ id, ...message }) => (
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              <Fragment key={id}>
                <Box className="message-box">{message.content}</Box>
              </Fragment>
            ))}
          </Box>
          <TextField
            id="message"
            label="Message"
            variant="outlined"
            onChange={(ev) => setNewMessage(ev.target.value)}
            value={newMessage}
          />
          <Box className="flex flex-row justify-center">
            <Button onClick={() => sendMessage()} className="btn btn-primary">
              Send
            </Button>
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Page;
