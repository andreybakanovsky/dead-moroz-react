import React from 'react';
import { Grid, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Goods() {
  const auth = useAuth();

  return auth.user ? (
    <Container >
      Goods
    </Container>
  ) : (
    <Container >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
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
      </Grid>
    </Container>
  );
}

export default Goods;
