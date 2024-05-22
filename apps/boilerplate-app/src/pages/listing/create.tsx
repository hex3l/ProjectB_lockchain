/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Autocomplete, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';

import { useBackendCall } from 'utils/useBackendCall';

const Page = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
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
  const [image, setImage] = useState<string | undefined>(undefined);

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
      })()
        .then(async () => {
          enqueueSnackbar('Listing created succesfully', { variant: 'success' });
          await router.push('/user/offers');
        })
        .catch((err) => {
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
      <Container maxWidth="md" className="pt-5">
        <Box className="flex justify-center items-center w-full">
          <Paper className="p-5 shadow-2xl z-[1000] flex flex-col space-y-5 w-full">
            {image && (
              <Box className="flex flex-row justify-center w-full">
                <img src={image} className="h-[300px] w-[300px] object-cover" />
              </Box>
            )}
            <TextField
              className="flex-1"
              label="Image URL"
              variant="outlined"
              value={image}
              placeholder="insert an image url (suggested 1:1 ratio)"
              onChange={(event) => setImage(event.target.value)}
            />
            <Box className="flex flex-col md:flex-row md:space-x-5">
              <TextField
                className="flex-1"
                label="Title"
                value={title}
                variant="outlined"
                placeholder="insert your title"
                onChange={(event) => setTitle(event.target.value)}
              />
              <Autocomplete
                className="flex-1"
                disablePortal
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onChange={(event, option) => {
                  setSelectedCategory(option);
                }}
                value={selectedCategory}
                options={categories.map((el) => el.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Select a category" placeholder="CMS development" />
                )}
              />
            </Box>
            <TextField
              label="Description"
              variant="outlined"
              value={description}
              placeholder="insert your description"
              onChange={(event) => setDescription(event.target.value)}
              multiline
              rows={3}
              maxRows={3}
            />
            <TextField
              color="primary"
              label="Amount"
              variant="outlined"
              value={price}
              type="number"
              placeholder={`0.004`}
              onChange={(ev) => {
                setPrice(parseFloat(ev.target.value));
              }}
            />
            <Button variant="contained" onClick={() => send()}>
              Create
            </Button>
          </Paper>
        </Box>
      </Container>
    </>
  );
};
export default Page;
