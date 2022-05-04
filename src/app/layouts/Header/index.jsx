import React, { useState, useCallback, useEffect } from 'react';
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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';

import useAuth from "../../../hooks/useAuth";
import AddGood from "../../../pages/AddGood";
import api from "../../../services/api";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [karma, setKarma] = useState(null);

  const onLogOut = () => {
    auth.logOut();
    navigate("/");
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (state) => setOpen(state);

  const loadKarma = useCallback(async () => {
    if (auth.user !== null && auth.user.role === 'elf') {
      try {
        const response = await api.auth.getKarma(auth.user.id);
        setKarma(response.data);
      } catch (e) {
        console.log(e.response.status);
        console.log(e.response.data);
      }
    }
  }, [auth.user]);

  useEffect(() => {
    loadKarma();
  }, [auth.user]);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 5,
      top: 32,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

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
                  {(auth.user.role === 'elf' && karma) &&
                    <StyledBadge
                      badgeContent={(karma != null) ? karma.value : 0}
                      color="success">
                      <IconButton
                        edge="start"
                        color='inherit'
                        component={Link} to={"/karma"} state={karma}
                      >
                        <StarIcon fontSize="large" />
                      </IconButton>
                    </StyledBadge>
                  }
                  <Button
                    color="inherit"
                    component={Link} to="/profile"
                  >
                    <Avatar
                      alt={auth.user.name}
                      src={auth.user.avatar}
                      sx={{ ml: 1, mr: 1 }}
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