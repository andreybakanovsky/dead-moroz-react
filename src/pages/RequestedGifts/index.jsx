import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  ButtonBase,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  useParams,
  useNavigate
} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

import api from "../../services/api";
import AddGift from "../AddGift";
import GiftUpdate from "../GiftUpdate";

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

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editGiftIds, setEditGiftIds] = useState(null);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleOpenEdit = (giftId) => {
    setOpenEdit(true);
    setEditGiftIds({ ...id, id: `${giftId}` });
  };

  const handleCloseAdd = (state) => { setOpenAdd(state) }
  const handleCloseEdit = (state) => {
    setOpenEdit(state); // the state see in a modal form
    setEditGiftIds(null);
  }

  const onDelete = async (giftId, giftName) => {
    var result = window.confirm(`Would you like to delete the "${giftName} ..." gift?`);
    try {
      if (result) {
        const allId = {
          ...id,
          "id": `${giftId}`
        }
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
          onClick={() => handleOpenAdd()}
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
      {data && data.map(requestedGift => {
        return <Grid sx={{ m: 2 }} key={requestedGift.id}>
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
                      {requestedGift.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {requestedGift.description}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton aria-label="edit"
                      onClick={() => handleOpenEdit(requestedGift.id)}
                    >
                      <EditIcon
                        sx={{ color: 'darkgray', fontSize: 20 }}
                      />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      onClick={() => onDelete(requestedGift.id, requestedGift.name)}
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
                  {(requestedGift.images[0] !== undefined) ?
                    <Img alt="" src={requestedGift.images[0].url} />
                    : null
                  }
                </ButtonBase>
              </Grid>

            </Grid>
          </Paper>
        </Grid>
      })}
      <AddGift setStateModal={handleCloseAdd} stateOpen={openAdd} />
      <GiftUpdate
        setStateModal={handleCloseEdit}
        stateOpen={openEdit}
        ids={editGiftIds} />
    </Container>
  );
}

export default RequestedGifts;
