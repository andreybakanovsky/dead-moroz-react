import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Avatar,
  Paper,
  Grid,
} from "@mui/material";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

import api from "../../services/api";

function User() {
  const [user, setUser] = useState();
  let id = useParams();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getUser(id);
      setUser(response.data);
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
      if (e.response.status === 404) {
        navigate("/not-found-404");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}
      >
        <Paper
          sx={{
            m: 4,
            p: 2,
            margin: 1,
            maxWidth: "auto",
            flexGrow: 1
          }}
        >
          {user &&
            <div>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 200, height: 200 }}
                label="avatar"
              />
              <h2> {user.name} </h2>
              <h3> Age: {user.age} </h3>
            </div>}
        </Paper>
      </Grid>
    </Container>
  );
}

export default User;
