import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Grid
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate,
  Link,
} from 'react-router-dom';

function Goods() {
  let id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

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
        <h2>MY GOODS</h2>
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
            <Card sx={{ borderRadius: 3, m: 3, maxWidth: 345 }} >
              <CardActionArea component={Link} to={`/users/${id.user_id}/goods/${good.id}`}>
                <CardMedia
                  component="img"
                  height="140"
                // image=".jpg"
                // alt="..."
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {good.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {good.content}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        })}
      </Grid>
    </Container>
  );
}

export default Goods;
