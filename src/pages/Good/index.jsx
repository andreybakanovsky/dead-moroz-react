import React, { useEffect, useState, useCallback } from 'react';
import {
  TextField,
  Grid,
  Container,
  Button,
  Snackbar,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import {
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';

function Good() {
  const id = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setMessageSnackbar("The Good update successfully")
      await api.auth.updateGood(id, { "good": data });
      setIsOpen(true);
    } catch (e) {
      if (e.response.status === 422) {
        Object.keys(e.response.data.errors).forEach((key) => {
          setError(key, {
            type: "manual",
            message: e.response.data.errors[key],
          });
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    var result = window.confirm(`Do you really want to delete ${year}'s good ?`);
    try {
      if (result) {
        const data = await api.auth.deleteGood(id);
        if (data.status === 204) {
          navigate(`/users/${id.user_id}/goods`);
        }
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };

  const loadData = useCallback(async () => {
    const { data } = await api.auth.getGood(id);
    setYear(data.year)
    reset({
      year: data.year,
      content: data.content
    });
  }, [id, reset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container >
      <Grid container spacing={1}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <h2>MY {year}'s GOOD</h2>
        </Grid>
        <Grid item xs={4}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="year"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={Boolean(errors.year?.message)}
                      fullWidth={true}
                      label="Year"
                      variant="outlined"
                      helperText={errors.year?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={5}
                      error={Boolean(errors.content?.message)}
                      fullWidth={true}
                      label="My Good"
                      variant="outlined"
                      helperText={errors.content?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  sx={{ mr: '1rem' }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Update
                </Button>
                <Button
                  sx={{ mr: '1rem' }}
                  variant="contained"
                  color="warning"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={8}>
          <ImageList
            sx={{ width: 300, height: 220 }}
            variant="quilted"
            cols={4}
            rowHeight={121}
          >

          </ImageList>
          <Button
            sx={{ mr: '1rem' }}
            variant="contained"
            color="primary"
            // onClick={}
            disabled={true}
          >
            upload photo
          </Button>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isOpen}
          autoHideDuration={6000}
          onClose={() => setIsOpen(false)}
          message={messageSnackbar}
        />
      </Grid>
    </Container>
  );
}

export default Good;
