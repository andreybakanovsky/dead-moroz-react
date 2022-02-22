import React, { useState } from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Button,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import AddGood from "../../../pages/AddGood";

const Header = () => {

  const auth = useAuth();
  const navigate = useNavigate();

  const onLogOut = () => {
    auth.logOut();
    navigate("/");
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (state) => setOpen(state);

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
                  <IconButton
                    edge="start"
                    color='inherit'
                    onClick={handleOpen}>
                    <AddCircleIcon />
                  </IconButton>
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
      <AddGood setStateModal={handleClose} stateOpen={open} />
    </React.Fragment>
  )
}

export default Header;