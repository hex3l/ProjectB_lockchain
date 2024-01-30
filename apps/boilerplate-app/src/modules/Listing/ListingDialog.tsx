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
  const [listingDialog, setListingDialog] = useState(false);

  useEffect(() => {
    if (listing) {
      setListingDialog(true);
    } else {
      setListingDialog(false);
    }
  }, [listing]);

  const handleClose = () => {
    const { pathname } = router;
    setListingDialog(false);
    router
      .push(
        {
          pathname: pathname,
        },
        pathname,
      )
      .catch((err) => console.log(err));
  };

  return (
    listing && (
      <Dialog
        open={listingDialog}
        onClose={handleClose}
        scroll={'body'}
        sx={{ padding: 0 }}
        className="rounded-xl"
        maxWidth={greaterThanMid ? 'desktop' : 'sm'}
      >
        <Listing id_listing={parseInt(listing, 10)} dialog closeDialog={handleClose} />
      </Dialog>
    )
  );
};
