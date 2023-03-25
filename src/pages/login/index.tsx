import { useLogin } from '@refinedev/core';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useForm } from 'react-hook-form';
import * as React from 'react';

import { DefaultLoginCredentials } from '../../types/types';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

export const Login = () => {
  const form = useForm<DefaultLoginCredentials>();

  const { mutate: login } = useLogin<DefaultLoginCredentials>();

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <FormContainer
            formContext={{ ...form }}
            defaultValues={{ username: '', password: '' }}
            onSuccess={async (credentials) => await login(credentials)}
          >
            <TextFieldElement
              margin="normal"
              fullWidth
              name="username"
              label="Username"
              autoComplete="username"
              autoFocus
              required
            />
            <TextFieldElement
              margin="normal"
              fullWidth
              type="password"
              name="password"
              label="Password"
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </FormContainer>
        </Box>
      </Box>
    </Container>
  );
};
