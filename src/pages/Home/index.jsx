import React from 'react';
import { Grid, Container, Typography, Button } from "@mui/material";
import {
  Link,
  Navigate,
} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Home() {
  const auth = useAuth();

  const urlRedirect = (role) => {
    if (role === 'kid') return `/users/${auth.user.id}/goods`;
    if (role === 'elf' || role === 'dead_moroz') return `/users`;
  };

  return (
    <Container >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        {(auth.user) ?
          <Navigate to={urlRedirect(auth.user.role)} />
          :
          <Grid item xs={6}>
            <Typography variant="h3" gutterBottom>
              Welcome for gifts!
            </Typography>
            <Button
              type="submit"
              variant="contained"
              style={{ width: 400 }}
              component={Link} to="/login"
            >
              Log In
            </Button>
          </Grid>
        }
      </Grid>
    </Container>
  )
}

export default Home;
