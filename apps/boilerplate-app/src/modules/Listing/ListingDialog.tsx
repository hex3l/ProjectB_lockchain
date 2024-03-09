import { Dialog, useMediaQuery } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { theme } from 'theme.mui';

import { Listing } from '.';

export const ListingDialog = () => {
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'));

  const router = useRouter();

  const searchParams = useSearchParams();
  const listing = searchParams.get('listing');
  const [idListing, setIdListing] = useState(0);
  const [listingDialog, setListingDialog] = useState(false);

  useEffect(() => {
    if (listing) {
      setIdListing(parseInt(listing, 10));
      setListingDialog(true);
    } else {
      setIdListing(0);
      setListingDialog(false);
    }
  }, [listing]);

  const handleClose = () => {
    const { pathname } = router;
    setListingDialog(false);
    const query = router.query;
    delete query.listing;
    router
      .push(
        {
          ...router,
          query,
        },
        pathname,
      )
      .catch((err) => console.log(err));
  };

  return (
    <Dialog
      open={listingDialog}
      onClose={handleClose}
      scroll={'body'}
      sx={{ padding: 0 }}
      className="rounded-xl"
      maxWidth={greaterThanMid ? 'desktop' : 'md'}
    >
      <Listing id_listing={idListing} dialog closeDialog={handleClose} />
    </Dialog>
  );
};
