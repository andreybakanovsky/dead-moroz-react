import React, { useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

import {
  useLocation,
} from 'react-router-dom';

function Karma() {
  const location = useLocation();
  const [karma, setKarma] = useState(location.state);

  const getRatingGifts = (count) => {
    let rating = [];
    for (let i = 0; i < count; i++) {
      rating.push(
        <CardGiftcardIcon
          key={i}
          className="dead-moroz-red-color"
          sx={{ fontSize: 24 }}
        />
      );
    }
    return rating;
  };

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>MY KARMA</h2>
      </Grid>
      <Paper
        sx={{
          m: 4,
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Typography gutterBottom variant="subtitle1" component="div">
          Suggested gifts was approved
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="h6" gutterBottom component="div">
          {karma.value}
        </Typography>
        <>
          {getRatingGifts(karma.value)}
        </>
      </Paper>
      <Paper
        sx={{
          m: 4,
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Typography gutterBottom variant="subtitle1" component="div">
          List approved gifts
        </Typography>
        <Divider sx={{ mb: 1 }} />
      </Paper>
    </Container>
  );
}

export default Karma;
