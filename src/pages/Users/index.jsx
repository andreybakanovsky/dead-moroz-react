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
import Pagination from '@mui/material/Pagination';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Cookies from "js-cookie";

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

const variantsUsersOnPage = ['10', '15', '20'];

function Users() {
  const [users, setUsers] = useState();
  const auth = useAuth();
  const [usersOnPage, setUsersOnPage] = useState(() => {
    const countFromCookies = Cookies.get("users-on-page");
    return (countFromCookies == null) ? variantsUsersOnPage[0] : countFromCookies;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [usersCount, setUsersCount] = useState(null);

  const loadData = async () => {
    const params = {
      page_size: usersOnPage,
      page: currentPage
    }
    try {
      const response = await api.auth.getUsers(params);
      setUsers(response.data.users);
      setUsersCount(response.data.metadata.records_count)
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, usersOnPage]);

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
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 2 }}
      >
        <Pagination
          sx={{ margin: 'flex' }}
          count={Math.ceil(usersCount / usersOnPage)}
          variant="outlined"
          shape="rounded"
          onChange={(event, newPage) => {
            setCurrentPage(newPage)
          }}
        />
        <Typography
          variant="body1"
          gutterBottom
          sx={{ ml: 10, display: 'inline-block' }}
          underline="none"
        >
          users per page
        </Typography>
        <Autocomplete
          disableClearable
          value={usersOnPage}
          onChange={(event, newValue) => {
            setUsersOnPage(newValue);
            Cookies.set("users-on-page", newValue);
          }}
          id="controllable-states"
          options={variantsUsersOnPage}
          sx={{ pl: 2, width: 60 }}
          renderInput={(params) =>
            <TextField {...params}
              size="small"
              inputProps={{ ...params.inputProps, style: { fontSize: "0.9rem" }, readOnly: true }}
              variant="standard"
              color="primary"
            />}
        />
      </Grid>
    </Container>

  );
}

export default Users;
