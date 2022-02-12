import React from 'react';
import { Grid, Container, Typography } from "@mui/material";

function NotFound() {

  return (
    <Container maxWidth="xs">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h2" gutterBottom>
              404
            </Typography>
            <Typography variant="h4" gutterBottom>
              Page not found.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NotFound;
