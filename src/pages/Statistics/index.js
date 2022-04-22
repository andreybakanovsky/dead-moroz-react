import React from 'react';
import {
  Grid,
  Container,
  Typography,
  Avatar,
  IconButton,
  Paper,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";
import {
  useParams,
  useLocation,
} from 'react-router-dom';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';

import api from "../../services/api";

function Statistics() {
  let id = useParams();
  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const [avrg, setAvrg] = useState(null);
  const [year, setYear] = useState();
  const [years, setYears] = useState();
  const [suggestedGifts, setSuggestedGifts] = useState();

  const handleChange = (event, newYear) => {
    if (newYear !== null)
      setYear(newYear);
  };

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getUserAvarageGrade(id);
      setAvrg(Math.round(response.data * 10) / 10);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadYears = useCallback(async () => {
    try {
      const response = await api.auth.getUserYears(id);
      setYears(response.data);
      setYear(response.data[0].year);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [id]);

  useEffect(() => {
    loadYears();
  }, [loadYears]);


  const loadSuggestedGifts = useCallback(async () => {
    if (year == null) return;
    try {
      const response = await api.auth.getSuggestedGiftsForYear(id, year);
      setSuggestedGifts(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [year]);

  useEffect(() => {
    loadSuggestedGifts();
  }, [loadSuggestedGifts]);

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  const makeChoice = async (currentGift) => {
    try {
      const response = await api.auth.updateDeadChoice(currentGift.id);
      let updateSuggestedGift = suggestedGifts.map(gift => {
        if (gift.id == currentGift.id) {
          return { ...gift, deads_choice: response.data }
        }
        return gift;
      });
      setSuggestedGifts(updateSuggestedGift);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }

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
            <Avatar alt={user.name} src={user.avatar} />
            <h2>{user.name}'s file</h2>
          </>
        }
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
        <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'inline-block' }}>
          Total grade
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="h6" gutterBottom component="div">
          {avrg}
        </Typography>
        <Rating
          // sx={{ mt: 2 }} 
          name="Rating"
          value={avrg}
          max={10}
          precision={0.1}
          icon={<AcUnitIcon className="dead-moroz-blue-color" fontSize="inherit" />}
          emptyIcon={<AcUnitIcon className="dead-moroz-grey-color" fontSize="inherit" />}
          readOnly
        />
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
        <Typography gutterBottom variant="subtitle1" component="div">
          Years
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <ToggleButtonGroup
          color="primary"
          value={year}
          exclusive={true}
          onChange={handleChange}
          size='string'
        >
          {years && years.map((year, i) => {
            return (
              <ToggleButton key={i} value={year.year}>{year.year}</ToggleButton>
            )
          })}
        </ToggleButtonGroup>
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
        <Typography gutterBottom variant="subtitle1" component="div">
          Suggested gifts - {year}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ margin: 0 }}>
          <Table size="small" aria-label="purchases">
            <TableHead
              sx={{ backgroundColor: "#f5f0f0" }}
            >
              <TableRow>
                <TableCell sx={{ width: "20%" }}>Name</TableCell>
                <TableCell                      >Description</TableCell>
                <TableCell sx={{ width: "13%" }}>Picture</TableCell>
                <TableCell align='center' sx={{ width: "13%" }}>Dead's choice </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suggestedGifts && suggestedGifts.map((suggestedGift, i) => (
                <TableRow
                  key={suggestedGift.id}
                >
                  <TableCell
                    sx={{ verticalAlign: 'top' }}
                    component="th"
                    scope="row">
                    {suggestedGift.name}
                  </TableCell>
                  <TableCell
                    sx={{ verticalAlign: 'top' }}>
                    {suggestedGift.description
                    }</TableCell>
                  <TableCell>
                    <ButtonBase sx={{ width: 96, height: 96 }}>
                      {(suggestedGift.images[0] !== undefined) ?
                        <Img alt="suggested gift" src={suggestedGift.images[0].url} />
                        : null
                      }
                    </ButtonBase>
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ verticalAlign: 'center' }}
                  >
                    <IconButton aria-label="gift"
                      onClick={() => suggestedGift.deads_choice = makeChoice(suggestedGift)}
                    >
                      {suggestedGift.deads_choice ?
                        <CardGiftcardIcon
                          className="dead-moroz-red-color"
                          sx={{ fontSize: 26 }}
                        />
                        :
                        <CardGiftcardIcon
                          className="dead-moroz-grey-color"
                          sx={{ fontSize: 26 }}
                        />
                      }
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {suggestedGifts && (suggestedGifts.length === 0) &&
                <TableRow>
                  <TableCell > </TableCell>
                  <TableCell align="center" >
                    there are no suggestions
                  </TableCell>
                  <TableCell > </TableCell>
                  <TableCell > </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Container>
  );
}

export default Statistics;
