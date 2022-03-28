import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import {
  useParams,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';

import '../../styles/App.css';
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

function Goods() {
  let id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const auth = useAuth();

  const location = useLocation();
  const [user, setUser] = useState(location.state); // ! 

  const loadUser = useCallback(async () => {
    try {
      const response = await api.auth.getUser(id);
      setUser(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [id]);

  useEffect(() => {
    if (user === null) {
      loadUser();
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getGoods(id);
      setData(response.data);
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
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {(user) &&
          <>
            {(auth.user.id === user.id) ?
              <h2>MY GOOD</h2>
              :
              <>
                <Avatar alt={user.name} src={user.avatar} />
                <h2>{user.name} - GOOD</h2>
              </>}
          </>
        }
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        item xs="auto"
      >
        {data && data.map(good => {
          return <Grid item xs={12} sm={6} md={4} key={good.id}>
            <Card sx={{ borderRadius: 2, m: 2, maxWidth: 345 }} >
              <CardHeader
                title={good.year}
                action={
                  <IconButton aria-label="edit"
                    component={Link} to={`/users/${id.user_id}/goods/${good.id}`}
                    state={{ good, user }}
                  >
                    {(id.user_id == auth.user.id) ?
                      <EditIcon
                        sx={{ color: 'darkgray', fontSize: 20 }}
                      />
                      :
                      <OpenInBrowserIcon
                        sx={{ color: 'darkgray', fontSize: 20 }}
                      />
                    }
                  </IconButton>
                }
              >
              </CardHeader>
              {(good.images[0] !== undefined) ?
                <CardMedia
                  component="img"
                  height="140"
                  src={good.images[0].url}
                  alt="good ..."
                >
                </CardMedia>
                : null
              }
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {good.content}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton aria-label="gift"
                  component={Link} to={`/users/${id.user_id}/goods/${good.id}/gifts`}
                  state={{ good, user }}
                >
                  <CardGiftcardIcon
                    className="dead-moroz-red-color"
                    sx={{ fontSize: 26 }}
                  />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        })}
      </Grid>
    </Container>
  );
}

export default Goods;
