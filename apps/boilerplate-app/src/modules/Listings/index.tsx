/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { ArrowLeft, ArrowRight, FilterAltOff, FilterList, Search } from '@mui/icons-material';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import {
  Accordion,
  AccordionSummaryProps,
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Slider,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { ListingDto } from 'dto/ListingDto';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useBackendCall } from 'utils/useBackendCall';

import categories from '../../common/categories.json';

import { OfferRow } from './OfferRow';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 100,
    label: '100',
  },
];

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(() => ({
  padding: 0,
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: 0,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

// eslint-disable-next-line import/no-default-export
export function Listings() {
  const router = useRouter();
  const backendCall = useBackendCall();

  const [listings, setListings] = useState<Array<ListingDto> | undefined>(undefined);

  // TODO: add pagination

  useEffect(() => {
    (async () => {
      const dbList = (await backendCall(
        `listing?${new URLSearchParams({
          page: '1',
          take: '10',
          id_category: '1',
        })}`,
        {},
      )) as Array<ListingDto>;

      setListings(dbList);
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  const [accordionState, setAccordionState] = useState([true, true, true]);
  const [acc1] = accordionState;

  const handleChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    const newAccordionState = [...accordionState];
    newAccordionState[panel] = isExpanded;
    setAccordionState(newAccordionState);
  };

  const categoryScroll = useRef<any>(null);
  const scroll = (scrollOffset: number) => {
    if (categoryScroll.current) categoryScroll.current['scrollLeft'] += scrollOffset;
  };

  return (
    <Fragment>
      <Box className="banner static-beach_bar">
        <div className="static-beach_bar__waves" />
        <div className="static-beach_bar__sand static-beach_bar__sand--background" />
        <div className="static-beach_bar__sand static-beach_bar__sand--foreground" />
        <Container maxWidth="xl">
          <Box className="w-full h-[250px] flex flex-col text-center justify-center items-center">
            <Box className="flex z-10">
              <Typography className="font-bukhari md:text-[4.5rem] md:leading-[4.5rem] text-[2.5rem] leading-[2.5rem] text-[#121212]">
                {router.query.category ? router.query.category : 'Listings'}
              </Typography>
            </Box>
            <Paper className="max-w-[700px] p-5 mt-[27px] flex flex-col md:flex-row gap-3 shadow-2xl z-[1000]">
              <TextField
                label="What are you looking for?"
                variant="outlined"
                value=" "
                disabled
                className="w-[250px]"
                inputProps={{ className: 'h-[6px]' }}
              />
              <Button variant="contained" startIcon={<Search />}>
                Search
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="xl" className="pt-10 flex flex-col gap-5">
        <Box className="flex flex-col md:flex-row gap-5">
          <Paper className="flex-1 flex h-[60px] items-center justify-center gap-3 px-5">
            <Typography className="font-bold md:flex hidden">CATEGORIES</Typography>
            <Box className="flex flex-1 flex-row gap-2 items-center w-0">
              <IconButton onClick={() => scroll(-100)}>
                <ArrowLeft />
              </IconButton>
              <Box className="overflow-x-hidden" ref={categoryScroll}>
                <Box className=" whitespace-nowrap">
                  {categories.map((option) => (
                    <Button
                      color="secondary"
                      key={option.label}
                      onClick={async () => {
                        await router.push(`/listings/${option.label}`);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>
              <IconButton onClick={() => scroll(100)}>
                <ArrowRight />
              </IconButton>
            </Box>
          </Paper>
          <Paper className="flex h-[60px] items-center justify-center gap-3 px-5">
            <Autocomplete
              className="flex-1"
              disablePortal
              options={['Title', 'Date', 'Price']}
              defaultValue={'TODO: orderby'}
              disableClearable
              popupIcon={null}
              renderInput={(params) => <TextField {...params} variant="standard" className="flex-col md:w-[100px]" />}
            />
            <IconButton>
              <FilterList></FilterList>
            </IconButton>
          </Paper>
        </Box>
        <Box className="flex flex-row gap-5">
          <Box className="w-[250px]" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Paper>
              <Box className="flex flex-col p-5 w-[250px]">
                <Box className="flex flex-row pb-5 items-center">
                  <Typography className="font-bold flex-1">FILTERS</Typography>
                  <IconButton>
                    <FilterAltOff></FilterAltOff>
                  </IconButton>
                </Box>
                <Typography className="font-bold">Price range (ETH)</Typography>
                <Slider
                  color="secondary"
                  getAriaLabel={() => 'Minimum distance'}
                  value={[10, 50]}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => {}}
                  valueLabelDisplay="auto"
                  marks={marks}
                  disableSwap
                />
                <Divider className="my-2" />
                <div>
                  <Accordion expanded={acc1} onChange={handleChange(0)}>
                    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                      <Typography className="font-bold">Extra</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit
                        amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Box>
            </Paper>
          </Box>
          <Box className="flex flex-wrap flex-row gap-5 justify-evenly">
            {listings?.map(({ id, ...listing }) => (
              <Fragment key={id}>
                <OfferRow {...{ id, ...listing }} />
              </Fragment>
            ))}
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
