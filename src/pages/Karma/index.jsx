import React, { useState } from 'react';
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

import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

function Karma() {
  const location = useLocation();
  const [karma] = useState(location.state);
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
    try {
      const response = await api.auth.getApprovedGifts(auth.user.id);
      setApprovedGifts(response.data);
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    }
  };

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

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
          Show approved gifts
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
                <TableCell sx={{ width: "20%" }}>Year</TableCell>
                <TableCell                      >Kid's name</TableCell>
                <TableCell                      >Gift's name</TableCell>
                <TableCell sx={{ width: "40%" }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedGifts && approvedGifts.map((approvedGift, i) => (
                <TableRow
                  key={approvedGift.gift_id}
                >
                  <TableCell
                    sx={{ verticalAlign: 'top' }}
                    component="th"
                    scope="row">
                    {approvedGift.year}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.user_name}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.gift_name}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {approvedGift.description}
                  </TableCell>
                </TableRow>
              ))}
              {approvedGifts && (approvedGifts.length === 0) &&
                <TableRow>
                  <TableCell align="left" >
                    there are no approved gifts
                  </TableCell>
                  <TableCell > </TableCell>
                  <TableCell > </TableCell>
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
