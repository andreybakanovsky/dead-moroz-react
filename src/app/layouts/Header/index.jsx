import * as React from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Button
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";

const Header = () => {

  const auth = useAuth();
  const navigate = useNavigate();

  const onLogOut = () => {
    auth.logOut();
    navigate("/");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton
              edge="start"
              color='inherit'
              component={Link} to="/"
            >
              <AutoAwesomeIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              deaD Moroz
            </Typography>
            {auth.isLoaded &&
              (auth.user ? (
                <>
                  <Button color="inherit" component={Link} to="/profile">
                    {auth.user.name}
                  </Button>
                  <Button color="inherit" onClick={onLogOut}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/signup">
                    Sign up
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Log in
                  </Button>
                </>
              ))}
          </Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
  )
}

export default Header;