import React, { useState } from 'react';
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  CssBaseline,
  Container,
  Button,
  Box,
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import AddGood from "../../../pages/AddGood";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Avatar from '@mui/material/Avatar';

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
              <AutoAwesomeIcon fontSize="large" />
            </IconButton>
            <Typography variant="h5" component="div" >
              deaD Moroz
            </Typography>
            <IconButton
              edge="start"
              color='inherit'
              component={Link} to="/users"
              sx={{ ml: 1 }}
            >
              <SupervisorAccountIcon fontSize="large" />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            {auth.isLoaded &&
              ((auth.user) ? (
                <>
                  {(auth.user.role === 'kid') &&
                    <Button
                      variant="outlined"
                      edge="start"
                      color='inherit'
                      onClick={handleOpen}
                      startIcon={<AddCircleIcon />}
                    >
                      Add good
                    </Button>}
                  <Button
                    color="inherit"
                    component={Link} to="/profile"
                  >
                    <Avatar 
                    alt="Remy Sharp"
                    src={auth.user.avatar}
                    sx={{ ml: 1,  mr: 1 }}
                    />
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