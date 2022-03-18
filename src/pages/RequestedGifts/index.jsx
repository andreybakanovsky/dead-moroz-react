import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  ButtonBase,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddGift from "../../pages/AddGift";

function RequestedGifts() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getRequestedGifts(id);
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

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (state) => setOpen(state);

  const onDelete = async (giftId, giftName) => {
    var result = window.confirm(`Would you like to delete the "${giftName} ..." gift?`);
    try {
      if (result) {
        const allId = {
          ...id,
          "id": `${giftId}`
        }
        console.log(allId);
        const data = await api.auth.deleteRequestedGifts(allId);
        if (data.status === 204) {
          navigate(`/users/${id.user_id}/goods/${id.good_id}/gifts`);
        }
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Requested gifts</h2>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={handleOpen}
        >
          <AddIcon
            className="dead-moroz-red-color"
            sx={{ fontSize: 32 }}
          />
        </IconButton>
      </Grid>
      <Grid
        container
        direction="row"
      >
      </Grid>
      {data && data.map(requestedGifts => {
        return <Grid sx={{ m: 2 }} key={requestedGifts.id}>
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 800,
              flexGrow: 1
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1" component="div">
                      {requestedGifts.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {requestedGifts.description}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      aria-label="edit"
                      onClick={() => onDelete(requestedGifts.id, requestedGifts.name)}
                    >
                      <DeleteOutlineIcon
                        sx={{ color: 'darkgray', fontSize: 24 }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item>
                <ButtonBase sx={{ width: 200, height: 200 }}>
                  {(requestedGifts.images[0] !== undefined) ?
                    <Img alt="" src={requestedGifts.images[0].url} />
                    : null
                  }
                </ButtonBase>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      })}
      <AddGift setStateModal={handleClose} stateOpen={open} />
    </Container>
  );
}

export default RequestedGifts;
