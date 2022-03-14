import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import ImageListItem from '@mui/material/ImageListItem';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

function Good() {
  const id = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageSnackbar, setMessageSnackbar] = useState();
  const inputFile = useRef(null);
  const [filesSuggested, setFilesSuggested] = useState();
  const [filesCurrent, setFilesCurrent] = useState();

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
    const formData = new FormData();
    try {
      setIsLoading(true);

      formData.append('good[year]', data.year);
      formData.append('good[content]', data.content);
      for (let i = 0; i < filesSuggested.length; i++) {
        formData.append("good[images][]", filesSuggested[i], filesSuggested[i].name)
      }

      setMessageSnackbar("The Good update successfully")
      await api.auth.updateGood(id, formData);
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
    setFilesCurrent(data.images);
    reset({
      year: data.year,
      content: data.content
    });
  }, [id, reset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openFileDialog = () => {
    inputFile.current.click();
  };

  const changeHandler = (e) => {
    const chosenfiles = [];
    const files = e.target.files;
    if (files.length > 0) setFilesCurrent(undefined);
    for (let i = 0; i < files.length; i++) {
      chosenfiles.push(files[i]);
    }
    setFilesSuggested(chosenfiles);
  }

  return (
    <Container >
      <Grid container spacing={2}>
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
              <Grid item xs='auto'>
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
                <input
                  style={{ display: 'none' }}
                  type="file"
                  multiple ref={inputFile}
                  name='image-uploader-1234556'
                  id="image-uploader-1234556"
                  onInput={(e) => changeHandler(e)}
                  accept="image/*"
                  value=''
                />
                <Button
                  sx={{ mr: '1rem' }}
                  variant="outlined"
                  color="primary"
                  onClick={openFileDialog}
                  startIcon={<AddAPhotoIcon />}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={8}>
          <ImageList sx={{ width: "auto", height: "auto" }} rowHeight="auto" variant="masonry">

            {filesCurrent && filesCurrent.map((file, i) => {
              return (
                <ImageListItem key={i}>
                  <img
                    src={file.url}
                    srcSet={file.url}
                    alt={"photo... "}
                    loading="lazy"
                  />
                </ImageListItem>)
            })}

            {filesSuggested && filesSuggested.map((file, i) => {
              return (
                <ImageListItem key={-i}>
                  <img
                    src={URL.createObjectURL(file)}
                    srcSet={URL.createObjectURL(file)}
                    alt={"photo... "}
                    loading="lazy"
                  />
                </ImageListItem>)
            })}

          </ImageList>
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
