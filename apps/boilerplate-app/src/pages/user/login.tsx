import { Box, Button, TextField, Typography } from '@mui/material';
import Link from 'next/link';

const Login = () => {
  return (
    <Box width="100%" height="100%" className="flex flex-col space-y-10 items-center justify-center align-middle mt-20">
      <Box className="flex flex-col space-y-5">
        <Typography variant="h2">Welcome!</Typography>
        <Typography variant="h4">Login to access your account!</Typography>
      </Box>
      <Box className="flex flex-col space-y-5">
        <TextField label="Email" type="email" />
        <TextField label="Password" type="password" />
        <Button variant="outlined" color="success">
          Login
        </Button>
      </Box>
      <Typography variant="h6">
        {"You don't have an account? "}
        <Link href="/user/register" className="underline">
          Register now
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
