import { Box, Button, TextField, Typography } from '@mui/material';
import Link from 'next/link';

const Register = () => {
  return (
    <Box width="100%" height="100%" className="flex flex-col space-y-10 items-center justify-center align-middle mt-20">
      <Box className="flex flex-col space-y-5">
        <Typography variant="h2">Welcome!</Typography>
        <Typography variant="h4">Register a new account!</Typography>
      </Box>
      <Box className="flex flex-col space-y-5">
        <TextField label="Username" type="text" />
        <TextField label="Email" type="email" />
        <TextField label="Password" type="password" />
        <TextField label="Repeat password" type="password" />
        <Button variant="outlined" color="success">
          Register
        </Button>
      </Box>
      <Typography variant="h6">
        Already an user?{' '}
        <Link href="/user/login" className="underline">
          Login here
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
