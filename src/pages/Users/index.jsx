import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import api from "../../services/api";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

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
  const [data, setData] = useState();

  const loadData = async () => {
    try {
      const response = await api.auth.getUsers();
      setData(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container >
      {data && data.map(user => {
        return <Grid sx={{ m: 2 }} key={user.id}>
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 800,
              flexGrow: 1
            }}
          >
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
          </Paper>
        </Grid>
      })}
    </Container>

  );
}

export default Users;
