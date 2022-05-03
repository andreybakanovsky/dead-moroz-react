import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { styled } from '@mui/material/styles';
import {
  useLocation,
} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ButtonBase from '@mui/material/ButtonBase';

import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

function Karma() {
  const location = useLocation();
  const [karma, setKarma] = useState(location.state);
  const [approvedGifts, setApprovedGifts] = useState(null);
  const auth = useAuth();

  const getRatingGifts = (count) => {
    let rating = [];
    for (let i = 0; i < count; i++) {
      rating.push(
        <CardGiftcardIcon
          key={i}
          className="dead-moroz-red-color"
          sx={{ fontSize: 24 }}
        />
      );
    }
    return rating;
  };

  const loadApprovedGifts = async () => {
    if (approvedGifts == null) {
      try {
        const response = await api.auth.getApprovedGifts(auth.user.id);
        setApprovedGifts(response.data);
      } catch (e) {
        console.log(e.response.status);
        console.log(e.response.data);
      }
    }
    else {
      setApprovedGifts(null);
    }
  };

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

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

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>MY KARMA</h2>
      </Grid>
      <Paper
        sx={{
          m: 4,
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Typography gutterBottom variant="subtitle1" component="div">
          Suggested gifts was approved
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="h6" gutterBottom component="div">
          {karma.value}
        </Typography>
        <>
          {getRatingGifts(karma.value)}
        </>
      </Paper>
      <Paper
        sx={{
          m: 4,
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Button
          variant="outlined"
          onClick={() => loadApprovedGifts()}
        >
          {(approvedGifts == null) ? 'Show approved gifts' : 'Hide approved gifts'}
        </Button>
      </Paper>
      {approvedGifts &&
        <Paper
          sx={{
            m: 4,
            p: 2,
            margin: 1,
            maxWidth: 'auto',
            flexGrow: 1
          }}
        >
          <Typography gutterBottom variant="subtitle1" component="div">
            List of approved gifts
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <Table size="small" aria-label="approvedGifts">
            <TableHead
              sx={{ backgroundColor: "#f5f0f0" }}
            >
              <TableRow>
                <TableCell sx={{ width: "10%" }}>Year</TableCell>
                <TableCell sx={{ width: "10%" }}>Kid's name</TableCell>
                <TableCell sx={{ width: "20%" }}>Gift's name</TableCell>
                <TableCell >Description</TableCell>
                <TableCell sx={{ width: "10%" }} >Picture</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedGifts && approvedGifts.map((approvedGift, i) => (
                <TableRow
                  key={approvedGift.id}
                >
                  <TableCell
                    sx={{ verticalAlign: 'top' }}
                    component="th"
                    scope="row">
                    {approvedGift.year}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.users_name}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.gifts_name}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.description}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    <ButtonBase sx={{ width: 96, height: 96 }}>
                      {(approvedGift.images[0] !== undefined) ?
                        <Img alt="" src={approvedGift.images[0].url} />
                        : null
                      }
                    </ButtonBase>
                  </TableCell>
                </TableRow>
              ))}
              {approvedGifts && (approvedGifts.length === 0) &&
                <TableRow>
                  <TableCell > </TableCell>
                  <TableCell > </TableCell>
                  <TableCell align="left" >
                    there are no approved gifts
                  </TableCell>
                  <TableCell > </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Paper>}
    </Container>
  );
}

export default Karma;
