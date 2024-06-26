import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useContext, useEffect, useMemo, useState } from 'react';

import { ServiceBayLogo } from 'modules/ServiceBayLogo';
import { Wallet } from 'modules/Wallet';
import { GlobalStateContext } from 'utils/GlobalState';

function TopBar() {
  const { state } = useContext(GlobalStateContext);
  const [localJwt, setlocalJwt] = useState(state.auth.jwt);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const pages = useMemo(() => {
    const pgs = [
      {
        label: 'Listings',
        url: '/listings/All',
      },
    ];

    if (state.auth.jwt) {
      pgs.push({
        label: 'Manage your Listings',
        url: '/user/offers',
      });
    }

    return pgs;
  }, [localJwt]);

  useEffect(() => {
    setlocalJwt(state.auth.jwt);
  }, [state.auth.jwt]);

  return (
    <>
      <AppBar sx={{ position: 'fixed', top: 0 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.url}>
                    <Link href={page.url}>
                      <Typography textAlign="center" className="no-underline text-white hover:no-underline">
                        {page.label}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Link href="/" className="text-decoration-none no-underline text-white">
              <Box className="flex flex-row items-center z-[1000]">
                <ServiceBayLogo />
                <Box className="rotate-[-12deg] translate-x-[-5px] translate-y-[-5px] topbar-logo-text">
                  <Typography className="font-bukhari text-[1rem] leading-[1rem]">
                    Service
                    <br />
                    Bay
                  </Typography>
                </Box>
              </Box>
            </Link>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {
                // logoText
              }
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Link key={page.url} href={page.url}>
                  <Button
                    key={page.label}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.label}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Wallet />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export { TopBar };
