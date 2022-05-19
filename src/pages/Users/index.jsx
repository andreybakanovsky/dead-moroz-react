import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import api from "../../services/api";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import GradingIcon from '@mui/icons-material/Grading';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import useAuth from "../../hooks/useAuth";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      // animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function Users() {
  const [users, setUsers] = useState();
  const auth = useAuth();

  const loadData = async () => {
    try {
      const response = await api.auth.getUsers();
      setUsers(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDelete = async (id) => {
    var result = window.confirm(`Would you like to delete the user?`);
    try {
      if (result) {
        await api.auth.deleteUser(id);
        const newUsers = users.filter(user => id !== user.id)
        setUsers(newUsers);
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };

  return (
    <Container >
      {users && users.map(user => {
        return <Grid sx={{ m: 2 }} key={user.id}>
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 800,
              flexGrow: 1
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="standard"
                >
                  <Avatar alt="Remy Sharp" src={user.avatar} />
                </StyledBadge>
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  sx={{ ml: 2, display: 'inline-block' }}
                  component={Link} to={`/users/${user.id}/goods/`} state={user}
                  underline="none"
                >
                  {user.name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {(auth.user.role === "dead_moroz") &&
                  <>
                  {(user.role === "kid") &&
                    <IconButton aria-label="Summarize"
                      component={Link} to={`/users/${user.id}/statistics`} state={user}
                    >
                      <GradingIcon
                        className="dead-moroz-green-color"
                        sx={{ fontSize: 26 }}
                      />
                    </IconButton>}
                    {(user.role !== "dead_moroz") &&
                    <IconButton
                      aria-label="delete"
                      onClick={() => onDelete(user.id)}
                    >
                      <DeleteOutlineIcon
                        sx={{ color: 'darkgray', fontSize: 26 }}
                      />
                    </IconButton>}
                  </>
                }
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      })}
    </Container>

  );
}

export default Users;
