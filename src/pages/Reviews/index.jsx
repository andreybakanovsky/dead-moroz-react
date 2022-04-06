import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Container,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import validationSchema from "./validation";
import GiftAddSuggestion from "../GiftAddSuggestion";

function Reviews() {
  const id = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const commentInputRef = useRef(null);

  const location = useLocation();
  const [user, setUser] = useState(location.state ? location.state.user : null);
  const [good, setGood] = useState(location.state ? location.state.good : null);
  const [requestedGifts, setRequestedGifts] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [reviewIds, setreviewIds] = useState(null);
  const [openArrowIcon, setOpenArrowIcon] = useState([]);

  const handleOpenAdd = (reviewId) => {
    setOpenAdd(true);
    setreviewIds({ ...id, review_id: `${reviewId}` });
  }
  const handleCloseAdd = (state) => { setOpenAdd(state) }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

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

  const loadGood = useCallback(async () => {
    try {
      const response = await api.auth.getGood(id);
      setGood(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [id]);

  useEffect(() => {
    if (good === null) {
      loadGood();
    }
  }, []);

  const loadRequestedGifts = useCallback(async () => {
    try {
      const response = await api.auth.getRequestedGifts(id);
      setRequestedGifts(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  }, [id]);

  useEffect(() => {
    loadRequestedGifts();
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const response = await api.auth.getReviews(id);
      setReviews(response.data);
      setOpenArrowIcon(Array(response.data.length).fill(false));
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
      if (e.response.status === 404) {
        navigate("/not-found-404");
      }
    } finally {
    }
  }, [id, navigate]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

  const onSubmit = async (data) => {
    data.comment = JSON.stringify({
      "comment": data.comment,
      "author": auth.user.name
    });

    data = {
      ...data,
      "user_id": auth.user.id,
      "good_id": id.good_id
    }

    try {
      setIsLoading(true);
      if (editMode === false) {
        await api.auth.addReview(id, data);
      }
      else {
        await api.auth.updateReview(ids(editReviewId), data);
      };
      const response = await api.auth.getReviews(id);
      setReviews(response.data);
    } catch (e) {
      if (e.response.status === 422) {
        Object.keys(e.response.data).forEach((key) => {
          setError(key, {
            type: "manual",
            message: e.response.data[key],
          });
        });
      }
    } finally {
      reset({
        grade: '',
        comment: ''
      });
      setIsLoading(false);
      setEditMode(false);
      setEditReviewId(null);
    }
  };

  const getGrade = () => Math.round(Math.random() * 5) + 5;
  const getDate = (date) => {
    const postDate = new Date(date);
    return postDate.toLocaleDateString('en-US',)
  }

  const getComment = (stringComment) => JSON.parse(stringComment).comment
  const getAuthor = (stringComment) => JSON.parse(stringComment).author

  const onDelete = async (reviewId) => {
    var result = window.confirm(`Would you like to delete the review?`);
    try {
      if (result) {
        const allIds = {
          ...id,
          "id": `${reviewId}`
        }
        const data = await api.auth.deleteReview(allIds);
        const response = await api.auth.getReviews(id);
        setReviews(response.data);
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };


  const onDeleteSuggestedGift = async (reviewId, giftId) => {
    var result = window.confirm(`Would you like to delete the gift?`);
    try {
      if (result) {
        const allIds = {
          ...id,
          "review_id": `${reviewId}`,
          "id": `${giftId}`
        }
        await api.auth.deleteSuggestedGift(allIds);
        loadSuggestedGifts(reviewId);
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  }


  const ids = (lastId) => {
    return {
      ...id,
      "id": `${lastId}`
    }
  }

  const allIds = (lastId) => {
    return {
      ...id,
      "review_id": `${lastId}`
    }
  }

  const onEditReview = useCallback(async (reviewId) => {
    const { data } = await api.auth.getReview(ids(reviewId));
    setEditMode(true);
    setEditReviewId(reviewId);
    commentInputRef.current.focus();
    reset({
      grade: data.grade,
      comment: getComment(data.comment)
    });
  }, [reset]);

  const OnCancel = () => {
    reset({
      grade: '',
      comment: ''
    });
    setEditMode(false);
    setEditReviewId(null);
  }

  const [suggestedGifts, setSuggestedGifts] = useState({});
  const loadSuggestedGifts = useCallback(async (reviewId) => {
    try {
      const response = await api.auth.getSuggestedGifts(allIds(reviewId));
      setSuggestedGifts(prev => ({
        ...prev,
        [reviewId]: response.data
      }));
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    }
  }, []);

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
            <h2>{user.name} - {good.year} - Reviews</h2>
          </>}
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography gutterBottom variant="subtitle1" component="div">
              Good
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography variant="body2" gutterBottom>
                      {good.content}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <ButtonBase sx={{ width: 200, height: 128 }}>
                  <Img alt="complex" src={good.images[0].url} />
                </ButtonBase>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Typography gutterBottom variant="subtitle1" component="div">
              Requested gifts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {requestedGifts && requestedGifts.map(requestedGift => {
              return <Grid key={requestedGift.id}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography variant="body2" gutterBottom>
                          {requestedGift.name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <ButtonBase sx={{ width: 96, height: 96 }}>
                      {(requestedGift.images[0] !== undefined) ?
                        <Img alt="" src={requestedGift.images[0].url} />
                        : null
                      }
                    </ButtonBase>
                  </Grid>
                </Grid>
              </Grid>
            })}
          </Grid>
        </Grid>
      </Paper >

      <Paper
        sx={{
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Typography gutterBottom variant="subtitle1" component="div">
          Reviews
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={1.3} >
              <Typography sx={{ display: 'inline-block', mt: 0.8 }} gutterBottom variant="subtitle1" component="div">
                {(!editMode) ? "A new review:" : "Edit the review:"}
              </Typography>
            </Grid>
            <Grid item xs={1.3}  >
              <Controller
                name="grade"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    id="textField-1"
                    size="small"
                    {...field}
                    error={Boolean(errors.grade?.message)}
                    fullWidth={true}
                    label="Grade 1..10"
                    variant="outlined"
                    helperText={errors.grade?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={0.5}  >
              <IconButton
                color="primary"
                aria-label="magic"
                component="span"
                onClick={() => {
                  setValue("grade", getGrade());
                }}
              >
                <AutoFixHighIcon
                  className="dead-moroz-red-color"
                  sx={{ transform: "rotate(180deg)", fontSize: 26, mr: 1 }}
                />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="comment"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    id="textField-2-multiline"
                    size="small"
                    {...field}
                    multiline
                    rows={1}
                    maxRows={4}
                    error={Boolean(errors.comment?.message)}
                    fullWidth={true}
                    label="Comment"
                    variant="outlined"
                    helperText={errors.comment?.message}
                    inputRef={commentInputRef}
                  />
                )}
              />
            </Grid>
            <Grid item xs={2.5}>
              {(editMode !== true) ?
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Add the review
                </Button>
                :
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    type="submit"
                  >
                    Update
                  </Button>
                  <Button
                    sx={{ ml: 1 }}
                    variant="contained"
                    color="inherit"
                    disabled={isLoading}
                    onClick={OnCancel}
                  >
                    Cancel
                  </Button>
                </>
              }
            </Grid>
          </Grid>
        </form>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: "#f5f0f0" }}
            >
              <TableRow >
                <TableCell sx={{ width: "10%" }}>Grade</TableCell>
                <TableCell sx={{ width: "40%" }}>Comment</TableCell>
                <TableCell sx={{ width: "15%" }}>Author</TableCell>
                <TableCell sx={{ width: "10%" }}>Changed</TableCell>
                <TableCell sx={{ width: "11%" }}>Author's tools</TableCell>
                <TableCell sx={{ width: "19%" }}>Suggested gifts </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews && reviews.map((review, index) =>
                <>
                  <TableRow
                    key={review.id}
                    sx={{ height: 10 }}
                    sx={{ fontStyle: (editMode && editReviewId === review.id) ? 'italic' : undefined }}
                    selected={(editMode && editReviewId === review.id)}
                  // sx={{ '& > *': { borderBottom: 'unset' } }}
                  >
                    <TableCell sx={{ padding: "16px 16px" }}>{review.grade}</TableCell>
                    <TableCell sx={{ padding: "16px 16px" }}>{getComment(review.comment)}</TableCell>
                    <TableCell sx={{ padding: "16px 16px" }}>{getAuthor(review.comment)}</TableCell>
                    <TableCell sx={{ padding: "16px 16px" }}>{getDate(review.updated_at)}</TableCell>
                    <TableCell sx={{ padding: "10px 16px" }}>
                      {(review.user_id === auth.user.id) &&
                        <>
                          {(editReviewId !== review.id) ?
                            <IconButton aria-label="edit"
                              onClick={() => onEditReview(review.id)}
                            >
                              <EditIcon
                                sx={{ color: 'darkgray', fontSize: 24 }}
                              />
                            </IconButton>
                            :
                            <IconButton aria-label="cancel edit"
                              onClick={() => OnCancel(review.id)}
                            >
                              <EditOffIcon
                                sx={{ color: 'darkgray', fontSize: 24 }}
                              />
                            </IconButton>}
                          {(!editMode) &&
                            <IconButton
                              aria-label="delete"
                              onClick={() => onDelete(review.id)}
                            >
                              <DeleteOutlineIcon
                                sx={{ color: 'darkgray', fontSize: 24 }}
                              />
                            </IconButton>}
                        </>
                      }
                    </TableCell>
                    <TableCell sx={{ padding: "0px 16px" }}>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          if ((openArrowIcon[index] === false)) loadSuggestedGifts(review.id);
                          setOpenArrowIcon(values => values.map((value, i) => i === index ? !value : value));
                        }}
                      >
                        {openArrowIcon[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={openArrowIcon[index]} timeout="auto" unmountOnExit>
                        <Grid container spacing={2} sx={{ mt: 0.3, mb: 1 }}>
                          <Grid item xs={1.7}>
                            <Typography sx={{ margin: 0 }} gutterBottom variant="subtitle1" component="div">
                              Suggested gifts:
                            </Typography>
                          </Grid>
                          <Grid item xs={10}>
                            <Box sx={{ margin: 0 }}>
                              <Table size="small" aria-label="purchases">
                                <TableHead
                                  sx={{ backgroundColor: "#f5f0f0" }}
                                >
                                  <TableRow>
                                    <TableCell sx={{ width: "20%" }}>Name</TableCell>
                                    <TableCell sx={{ width: "70%" }}>Description</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Picture</TableCell>
                                    <TableCell sx={{ width: "10%" }}>Tools</TableCell>

                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(suggestedGifts[review.id] !== undefined) && suggestedGifts[review.id].map((suggestedGift) => (
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
                                            <Img alt="" src={suggestedGift.images[0].url} />
                                            : null
                                          }
                                        </ButtonBase>
                                      </TableCell>

                                      <TableCell>
                                        <IconButton
                                          aria-label="delete"
                                          onClick={() => onDeleteSuggestedGift(review.id, suggestedGift.id)}
                                        >
                                          {(review.user_id === auth.user.id) &&
                                            <DeleteOutlineIcon
                                              sx={{ color: 'darkgray', fontSize: 24 }}
                                            />}
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>

                                  ))}
                                  {(review.user_id === auth.user.id) &&
                                    <TableRow>
                                      <TableCell > </TableCell>
                                      <TableCell ></TableCell>
                                      <TableCell align="right" >Add gift</TableCell>
                                      <TableCell >
                                        <IconButton
                                          color="primary"
                                          aria-label="upload picture"
                                          component="span"
                                          onClick={() => handleOpenAdd(review.id)}
                                        >
                                          <AddIcon
                                            className="dead-moroz-red-color"
                                            sx={{ fontSize: 24 }}
                                          />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>}
                                </TableBody>
                              </Table>
                            </Box>
                          </Grid>
                        </Grid>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper >
      <GiftAddSuggestion
        setStateModal={handleCloseAdd}
        stateOpen={openAdd}
        ids={reviewIds}
      />
    </Container>
  );
}

export default Reviews;
