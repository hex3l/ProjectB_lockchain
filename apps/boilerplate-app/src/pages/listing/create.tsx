import {
  Autocomplete,
  Box,
  Button,
  Container,
  FilledInput,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const backendCall = useBackendCall();
  const [categories, setCategories] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [image, setImage] = useState<string | undefined>('www.google.com/image/pene');

  useEffect(() => {
    (async () => {
      const categories: unknown = await backendCall(`listing/categories`);
      if (categories) {
        const categoriesData = categories as Array<{ id: number; name: string }>;
        setCategories(categoriesData);
      }
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  const send = useCallback(() => {
    if (selectedCategory && title && description && price) {
      (async () => {
        await backendCall(`listing`, {
          method: 'POST',
          body: JSON.stringify({
            title,
            image,
            description,
            price,
            category: categories.find((el) => el.name === selectedCategory)?.id,
          }),
        });
      })().catch((err) => {
        console.error(err);
      });
    }
  }, [selectedCategory, title, description, price, image, backendCall]);

  return (
    <>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[130px] flex text-center justify-center items-center">
            <Box className="flex z-10">
              <Typography className="font-bukhari md:text-[4.5rem] text-[2.5rem] leading-[2.5rem] text-[#121212]">
                Create a new listing
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="xl">
        <Box className="flex justify-center items-center w-full">
          <Paper className="p-5 shadow-2xl z-[1000] flex flex-col w-full">
            <Box className="flex flex-row w-full">
              <Box className="flex justify-right items-right w-[500px]">
                <Autocomplete
                  className="flex-1"
                  disablePortal
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={(event, option) => {
                    setSelectedCategory(option);
                  }}
                  options={categories.map((el) => el.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select a category" placeholder="CMS development" />
                  )}
                />
              </Box>
            </Box>
            <TextField
              className="w-1/2"
              id="standard-basic"
              label="Title"
              variant="standard"
              placeholder="insert your title"
              onChange={(event) => setTitle(event.target.value)}
            />
            <TextField
              id="standard-basic"
              label="Description"
              variant="standard"
              placeholder="insert your description"
              onChange={(event) => setDescription(event.target.value)}
              multiline
              maxRows={3}
            />
            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
              <FilledInput
                id="filled-adornment-amount"
                color="primary"
                value={price}
                type="number"
                placeholder={`price`}
                onChange={(ev) => {
                  setPrice(parseFloat(ev.target.value));
                }}
              />
            </FormControl>
            <Button onClick={() => send()}>Create</Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};
export default Page;
