import React from 'react';
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Grid,
  Container,
  Button,
  Typography,
  Snackbar,
  Avatar,
  IconButton,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';

function Profile() {
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [avatars, setAvatars] = useState([]);

  const getAvaId = () => Math.round(Math.random() * 1000000);

  function generateAvatars() {
    let i = 0;
    const avatars = [];
    while (i < 12) {
      avatars.push({ avaUrl: `https://avatars.dicebear.com/api/adventurer/${getAvaId()}.svg` });
      i++;
    }
    setAvatars(avatars);
  }

  function handleOpen() {
    generateAvatars();
    setOpen(true);
  }

  const handleClose = (url) => {
    if (url !== undefined) {
      auth.setUser((prevState) => ({
        ...prevState,
        avatar: url
      }))
    };
    setAvatars([]);
    setOpen(false);
  };

  function showAvatars() {
    handleOpen();
  }

  function delAvatar() {
    auth.setUser((prevState) => ({
      ...prevState,
      avatar: ''
    }))
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      data = {
        ...data,
        "avatar": auth.user.avatar
      }
      await api.auth.updateProfile({ "user": data });
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
      const response = await api.auth.getProfile();
      auth.setUser(response.data);
      setIsLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    const { data } = await api.auth.getProfile();
    reset({
      name: data.name,
      age: data.age
    });
  }, [reset]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container maxWidth="xs">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '60vh' }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                mb: '0.8rem'
              }}
            >
              My profile
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Avatar
                alt="Remy Sharp"
                src={auth.user.avatar}
                sx={{ width: 200, height: 200 }}
                label="avatar"
              />

            </Grid>
            <Grid
              item
              xs={4}
              container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                sx={{
                  textTransform: 'none',
                  mb: '0.8rem'
                }}
                fullWidth={true}
                variant="outlined"
                onClick={showAvatars}
              >
                Add an ava
              </Button>
              <Button
                style={{ textTransform: 'none' }}
                variant="outlined"
                fullWidth={true}
                onClick={delAvatar}
              >
                Del the ava
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={Boolean(errors.name?.message)}
                    fullWidth={true}
                    label="Name"
                    variant="outlined"
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="age"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={Boolean(errors.age?.message)}
                    fullWidth={true}
                    label="Age"
                    variant="outlined"
                    helperText={errors.age?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isOpen}
          autoHideDuration={6000}
          onClose={() => setIsOpen(false)}
          message="Profile updated successfully"
        />
      </Grid>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ height: 30 }}
          >
            <IconButton
              edge="start"
              color='warning'
              style={{ float: 'left' }}
              onClick={() => handleClose()}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              edge="start"
              color='primary'
              style={{ float: 'right' }}
              onClick={generateAvatars}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
          <ImageList sx={{ width: 480, height: 480 }} cols={4} rowHeight={100}>
            {avatars.map((item) => (
              <ImageListItem
                key={item.avaUrl}
                onClick={() => handleClose(item.avaUrl)}
              >
                <img
                  src={`${item.avaUrl}?w=32&h=32&fit=crop&auto=format`}
                  srcSet={`${item.avaUrl}?w=32&h=32&fit=crop&auto=format&dpr=2 2x`}
                  loading="lazy"
                  alt='ava'
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Modal>
    </Container >
  );
}

export default Profile;
