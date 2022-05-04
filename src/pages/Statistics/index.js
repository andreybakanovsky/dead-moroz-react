import React from 'react';
import {
  Grid,
  Container,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Snackbar,
  SnackbarContent,
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
  const [requestedGifts, setRequestedGifts] = useState();
  const [reviews, setReviews] = useState();
  const [isOpen, setIsOpen] = useState(false);

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

  const loadRequestedGifts = useCallback(async () => {
    if (year == null) return;
    try {
      const response = await api.auth.getRequestedGiftsForYear(id, year);
      setRequestedGifts(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [year]);

  useEffect(() => {
    loadRequestedGifts();
  }, [loadRequestedGifts]);

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

  const loadReviews = useCallback(async () => {
    if (year == null) return;
    try {
      const response = await api.auth.getReviewsForYear(id, year);
      setReviews(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [year]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const getComment = (stringComment) => JSON.parse(stringComment).comment;
  const getAuthor = (stringComment) => JSON.parse(stringComment).author
  const getDate = (date) => {
    const postDate = new Date(date);
    return postDate.toLocaleDateString('en-US',)
  }

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  const makeChoice = async (currentGift) => {
    const data = {
      "deads_choice": !currentGift.deads_choice
    }
    try {
      const response = await api.auth.updateDeadChoice(currentGift.id, data);
      let updateSuggestedGift = suggestedGifts.map(gift => {
        if (gift.id == currentGift.id) {
          return { ...gift, deads_choice: response.data }
        }
        return gift;
      });
      setSuggestedGifts(updateSuggestedGift);
      if (response.data == true) setIsOpen(true);
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
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper
            sx={{
              m: 4,
              p: 2,
              margin: 1,
              maxWidth: 'auto',
              flexGrow: 1,
              height: 150
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

        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              m: 4,
              p: 2,
              margin: 1,
              maxWidth: 'auto',
              flexGrow: 1,
              height: 150
            }}
          >
            <Typography gutterBottom variant="subtitle1" component="div">
              Total grade
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="h6" gutterBottom component="div">
              {avrg}
            </Typography>
            <Rating
              name="Rating"
              value={avrg}
              max={10}
              precision={0.1}
              icon={<AcUnitIcon className="dead-moroz-blue-color" fontSize="inherit" />}
              emptyIcon={<AcUnitIcon className="dead-moroz-grey-color" fontSize="inherit" />}
              readOnly
            />
          </Paper>
        </Grid>
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
          Requested gifts - {year}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Table size="small" aria-label="requestedGifts">
          <TableHead
            sx={{ backgroundColor: "#f5f0f0" }}
          >
            <TableRow>
              <TableCell sx={{ width: "20%" }}>Name</TableCell>
              <TableCell >Description</TableCell>
              <TableCell sx={{ width: "13%" }}>Picture</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestedGifts && requestedGifts.map((requestedGift, i) => (
              <TableRow
                key={requestedGift.id}
              >
                <TableCell
                  sx={{ verticalAlign: 'top' }}
                  component="th"
                  scope="row">
                  {requestedGift.name}
                </TableCell>
                <TableCell
                  sx={{ verticalAlign: 'top' }}>
                  {requestedGift.description
                  }</TableCell>
                <TableCell>
                  <ButtonBase sx={{ width: 96, height: 96 }}>
                    {(requestedGift.images[0] !== undefined) ?
                      <Img alt="suggested gift" src={requestedGift.images[0].url} />
                      : null
                    }
                  </ButtonBase>
                </TableCell>
              </TableRow>
            ))}
            {requestedGifts && (requestedGifts.length === 0) &&
              <TableRow>
                <TableCell align="left" >
                  there are no requests
                </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
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
          Reviews - {year}
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Table size="small" aria-label="reviews">
          <TableHead
            sx={{ backgroundColor: "#f5f0f0" }}
          >
            <TableRow >
              <TableCell                      >Comment</TableCell>
              <TableCell sx={{ width: "15%" }}>Grade</TableCell>
              <TableCell sx={{ width: "15%" }}>Author</TableCell>
              <TableCell sx={{ width: "15%" }}>Changed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews && reviews.map((review, index) =>
              <TableRow
                key={review.id}
              // sx={{ height: 10 }}
              >
                <TableCell >{getComment(review.comment)}</TableCell>
                <TableCell >{review.grade}</TableCell>
                <TableCell >{getAuthor(review.comment)}</TableCell>
                <TableCell >{getDate(review.updated_at)}</TableCell>
              </TableRow>
            )}
            {reviews && (reviews.length === 0) &&
              <TableRow>
                <TableCell align="left" >
                  there are no comments
                </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
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
        <Table size="small" aria-label="suggestedGifts">
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
                <TableCell align="left" >
                  there are no suggestions
                </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => setIsOpen(false)}
      >
        <SnackbarContent
          message="+1 to the elf's karma"
        />
      </Snackbar>
    </Container>
  );
}

export default Statistics;
