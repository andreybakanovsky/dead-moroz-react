import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Container,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import validationSchema from "./validation";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const id = useParams();
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState(() => Object.fromEntries([...searchParams]));
  const [invitationApproved, setInvitationApproved] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const uuidValidation = (string) => {
    const regexExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i; // v4
    return regexExp.test(string)
  }

  const notFound = () => {
    navigate("/not-found-404");
  }

  const checkInvitation = useCallback(async () => {
    const queryParams = Object.fromEntries([...searchParams])
    if (uuidValidation(queryParams.some_magic)) {
      const data = {
        "invitation_token": queryParams.some_magic,
        "email": queryParams.email
      };
      try {
        const response = await api.auth.checkInvitationSignup(id.invitation_id, data);
        if (response.status === 200) {
          setInvitationApproved(true);
          setValue('name', queryParams.name)
          setValue('email', queryParams.email)
        }
      } catch (e) {
        console.log(e.response.status);
        console.log(e.response.data);
        if (e.response.status === 404) {
          notFound();
        }
      }
    }
    else {
      notFound();
    }
  }, []);

  useEffect(() => {
    setInvitationApproved(false);
    if ('invitation_id' in id) {
      checkInvitation();
    }
    setQueryParams(() => Object.fromEntries([...searchParams]));
  }, [checkInvitation]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if ('invitation_id' in id) {
        const signupData = {
          "invitation_id": id.invitation_id,
          "invitation_token": queryParams.some_magic,
          "email": queryParams.email,
          "user": {
            "role": 1,
            ...data
          }
        }
        await api.auth.signup(signupData);
      }
      else {
        await api.auth.signup({
          "user": data // devise gem requests "user"
        });
      }
      const { data: loginData } = await api.auth.login({
        "user": data
      });
      auth.setToken(loginData.api_token);
      auth.setUser(loginData);
    } catch (e) {
      if (e.response.status === 422) {
        Object.keys(e.response.data).forEach((key) => {
          setError(key, {
            type: "manual",
            message: e.response.data[key],
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {(id && ('invitation_id' in id)) ?
          <h2>You've been invited to join the deaD Moroz application as an Elf</h2>
          :
          <h2> </h2>
        }
      </Grid>
      <Container maxWidth="xs">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '50vh' }}
        >
          <Paper
            sx={{
              m: 4,
              p: 2,
              margin: 1,
              maxWidth: 'auto',
              flexGrow: 1
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: '1rem'
                  }}
                >
                  {(id && ('invitation_id' in id)) ? "Finish creating your account" : "Create an account"}
                </Typography>
              </Grid>
            </Grid>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}
                >
                  <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.name?.message)}
                        fullWidth={true}
                        label="Name"
                        variant="outlined"
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="age"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.age?.message)}
                        fullWidth={true}
                        label="Age"
                        variant="outlined"
                        helperText={errors.age?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.email?.message)}
                        fullWidth={true}
                        type="email"
                        label="Email"
                        variant="outlined"
                        helperText={errors.email?.message}
                        disabled={(invitationApproved) ? true : false}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.password?.message)}
                        type="password"
                        fullWidth={true}
                        label="Password"
                        variant="outlined"
                        helperText={errors.password?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="password_confirmation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={Boolean(errors.password_confirmation?.message)}
                        type="password"
                        fullWidth={true}
                        label="Password confirmation"
                        variant="outlined"
                        helperText={errors.password_confirmation?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    Sign up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Container>
    </Container>
  );
}

export default Signup;
