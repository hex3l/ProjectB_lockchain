/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { FilterAltOff, FilterList, Search } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputLabel,
  Paper,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { useBackendCall } from 'utils/useBackendCall';
import { useInfiniScrollListings } from 'utils/useInfiniScrollListings';

import { OfferRow } from './OfferRow';

const marks = [
  {
    value: 0,
    label: 0,
  },
  {
    value: 2,
    label: 2,
  },
];

// eslint-disable-next-line import/no-default-export
export function Listings() {
  const router = useRouter();
  const backendCall = useBackendCall();
  const [search, setSearch] = useState<string | null | undefined>(undefined);
  const [userSearch, setUserSearch] = useState<string | null | undefined>(undefined);
  const [category, setCategory] = useState<string | null | undefined>(undefined);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [priceRange, setPriceRange] = useState<Array<number>>([0, 100]);
  const [userPriceRange, setUserPriceRange] = useState<Array<number>>([0, 100]);
  const [orderByType, setOrderByType] = useState<string>('Title');
  const [orderByDirection, setOrderByDirection] = useState<'ASC' | 'DESC'>('DESC');

  const { listings, PullListings } = useInfiniScrollListings({
    category,
    search,
    lowerPrice: priceRange[0],
    higherPrice: priceRange[1],
    orderByDirection,
    orderByType,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && router.query.category) {
      setSearch(Array.isArray(router.query.search) ? router.query.search[0] : router.query.search ?? null);
      setUserSearch(Array.isArray(router.query.search) ? router.query.search[0] : router.query.search ?? null);
      setCategory(Array.isArray(router.query.category) ? router.query.category[0] : router.query.category ?? null);
    }
  }, [router.query.search, router.query.category]);

  useEffect(() => {
    (async () => {
      const categories = (await backendCall(`listing/categories`)) as Array<{ id: number; name: string }>;
      setCategories(categories);
    })().catch((err) => {
      console.error(err);
    });
  }, []);

  const handlePriceRangeChange = (event: Event, newValue: number | Array<number>) => {
    setUserPriceRange(newValue as Array<number>);
  };

  useEffect(() => {
    const tmo = setTimeout(() => {
      setPriceRange(userPriceRange);
    }, 500);
    return () => {
      clearTimeout(tmo);
    };
  }, [userPriceRange]);

  const resetFilters = useCallback(() => {
    setUserPriceRange([0, 2]);
  }, []);

  const handleSearch = useCallback(async () => {
    const params: Record<string, string> = {};
    if (userSearch) params.search = userSearch;
    await router.push(`/listings/${encodeURI(category ?? '')}?${new URLSearchParams(params)}`);
  }, [userSearch, category]);

  // ///////////////////////////////////////////////////////////////
  // Handle sticky sidebar
  const [sidebarTop, setSidebarTop] = useState<number | undefined>(undefined);
  const [topbarTop, setTopbarTop] = useState<number | undefined>(undefined);
  const [topbarWidth, setTopbarWidth] = useState<number | undefined>(undefined);
  const [topbarHeight, setTopbarHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar')?.getBoundingClientRect();
    const topbar = document.querySelector('.topbar')?.getBoundingClientRect();
    setSidebarTop(sidebar?.top ?? undefined);
    setTopbarTop(topbar?.top ?? undefined);
    setTopbarWidth(topbar?.width ?? undefined);
    setTopbarHeight(topbar?.height ?? undefined);
  }, []);

  const isStickySidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const scrollTop = window.scrollY;
    if (scrollTop >= (sidebarTop ?? 0) - 168) {
      sidebar?.classList.add('is-sticky-sidebar');
    } else {
      sidebar?.classList.remove('is-sticky-sidebar');
    }
  };

  useEffect(() => {
    if (!sidebarTop) return;

    window.addEventListener('scroll', isStickySidebar);
    return () => {
      window.removeEventListener('scroll', isStickySidebar);
    };
  }, [sidebarTop]);

  const isStickyTopbar = () => {
    const sidebar = document.querySelector('.topbar');
    const scrollTop = window.scrollY;
    if (scrollTop >= (topbarTop ?? 0) - 88) {
      sidebar?.classList.add('is-sticky-topbar');
    } else {
      sidebar?.classList.remove('is-sticky-topbar');
    }
  };

  useEffect(() => {
    if (!topbarTop) return;

    window.addEventListener('scroll', isStickyTopbar);
    return () => {
      window.removeEventListener('scroll', isStickyTopbar);
    };
  }, [topbarTop]);

  // ///////////////////////////////////////////////////////////////

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
                {category ? category : <CircularProgress className="text-[#121212]" />}
              </Typography>
            </Box>
            <Paper className="max-w-[700px] p-5 mt-[27px] flex flex-col md:flex-row gap-3 shadow-2xl z-[1000]">
              <TextField
                label="What are you looking for?"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={userSearch}
                className="w-[250px]"
                onChange={(event) => setUserSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button variant="contained" startIcon={<Search />} onClick={() => handleSearch()}>
                Search
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="xl" className="pt-5 flex flex-col gap-5">
        <Box className="flex flex-row">
          <Box
            className="flex flex-col md:flex-row"
            sx={{
              height: topbarHeight ? `${topbarHeight}px !important` : 0,
            }}
          />
          <Box
            className="topbar flex flex-col md:flex-row gap-5"
            sx={{ width: topbarWidth ? `${topbarWidth}px !important` : '100%' }}
          >
            <Paper className="flex-1 flex h-[60px] items-center justify-center gap-3 px-5">
              <Typography className="font-bold md:flex hidden">CATEGORIES</Typography>
              <Box className="flex flex-1 flex-row gap-2 items-center overflow-x-auto">
                <Box className=" whitespace-nowrap">
                  {categories?.map((option) => (
                    <Button
                      color={category === option.name ? 'primary' : 'secondary'}
                      key={option.name}
                      onClick={async () => {
                        setCategory(option.name);
                        await router.push(`/listings/${option.name}`);
                      }}
                    >
                      {option.name}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        <Box className="flex flex-row gap-5">
          <Box className="h-full flex-col" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box className="w-[250px]" />
            <Paper className="sidebar">
              <Box className="flex flex-col space-y-5 p-5 w-[250px]">
                <Box className="flex flex-row items-center">
                  <Typography className="font-bold flex-1">FILTERS</Typography>
                  <IconButton onClick={() => resetFilters()}>
                    <FilterAltOff></FilterAltOff>
                  </IconButton>
                </Box>
                <Box className="flex flex-row">
                  <Autocomplete
                    className="flex-1"
                    disablePortal
                    options={['Title', 'Date', 'Price']}
                    value={orderByType}
                    disableClearable
                    renderInput={(params) => <TextField {...params} variant="standard" label="Order by" />}
                    onChange={(event, option) => setOrderByType(option)}
                  />
                  <IconButton
                    className="flex"
                    onClick={() => setOrderByDirection(orderByDirection === 'DESC' ? 'ASC' : 'DESC')}
                  >
                    <FilterList className={`${orderByDirection !== 'DESC' ? 'rotate-180' : ''} transition-all`} />
                  </IconButton>
                </Box>
                <Box>
                  <InputLabel shrink>Price range (ETH)</InputLabel>
                  <Box className="px-2">
                    <Slider
                      color="secondary"
                      getAriaLabel={() => 'Minimum distance'}
                      value={userPriceRange}
                      step={0.0001}
                      min={0}
                      max={2}
                      // eslint-disable-next-line @typescript-eslint/no-empty-function
                      onChange={handlePriceRangeChange}
                      valueLabelDisplay="auto"
                      marks={marks}
                      disableSwap
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
          <Box className="w-full flex flex-wrap flex-row gap-5 justify-evenly transition-all">
            {listings?.map(({ id, ...listing }) => (
              <Fragment key={id}>
                <OfferRow {...{ id, ...listing }} />
              </Fragment>
            ))}
            <PullListings />
          </Box>
        </Box>
      </Container>
    </Fragment>
  );
}
