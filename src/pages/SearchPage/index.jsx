import React, { useRef, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper
} from "@mui/material";

import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function SearchPage() {
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Paper
          component="form"
          sx={{ m: 2, p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search gifts"
            inputProps={{ 'aria-label': 'search google maps' }}
            inputRef={searchRef}
          />
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
    </Container>
  );
}

export default SearchPage;
