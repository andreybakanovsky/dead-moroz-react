import * as React from 'react';
import {
  AppBar,
  Grid,
  Toolbar,
  CssBaseline,
  Container,
} from "@mui/material";
import { Link } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import Chip from '@mui/material/Chip';

const Footer = () => {

  const auth = useAuth();

  return (
    <React.Fragment>
      <CssBaseline />
      {auth.isLoaded &&
        (auth.user ? (
          <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
            <Container maxWidth="lg">
              <Toolbar>
                <Container>
                  <Grid sx={{ m: '1rem' }} color="primary" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Chip
                      sx={{ mr: '1rem' }}
                      label="Users"
                      component={Link} to="/users"
                      variant="outlined"
                      clickable />
                    <Chip
                      sx={{ mr: '1rem' }}
                      label="Goods"
                      component={Link} to={`/users/1/goods`}
                      variant="outlined"
                      clickable />
                    <Chip
                      sx={{ mr: '1rem' }}
                      label="requested Gifts"
                      component={Link} to={`/users/1/goods/19/gifts`}
                      variant="outlined"
                      clickable />
                    <Chip
                      sx={{ mr: '1rem' }}
                      label="Reviews"
                      component={Link} to="/users/1/goods/19/reviews"
                      variant="outlined"
                      clickable />
                    <Chip
                      sx={{ mr: '1rem' }}
                      label="suggested Gifts"
                      component={Link} to={`/users/1/goods/19/reviews/2/gifts`}
                      variant="outlined"
                      clickable />
                  </Grid>
                </Container>
              </Toolbar>
            </Container>
          </AppBar>
        ) : (
          <></>
        ))}
    </React.Fragment>
  )
}

export default Footer;