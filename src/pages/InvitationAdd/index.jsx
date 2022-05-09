import React, { useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import {
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const InvitationAdd = (props) => {
  const id = useParams();
  const handleClose = () => {
    props.setStateModal(false)
    reset();
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

  const onSubmit = async (data) => {
    const fullData = {
      "status": 0,
      ...data
    }

    try {
      await api.auth.addInvitation(fullData);
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
      handleClose();
      reset();
    }
  };

  const onCancel = () => {
    handleClose();
  };

  return (
    <Modal
      open={props.stateOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={style}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                textAlign="center"
                sx={{ mb: '0.5rem' }}>
                Invitate an elf
              </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="user_name"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={Boolean(errors.user_name?.message)}
                    fullWidth={true}
                    label="Name"
                    variant="outlined"
                    helperText={errors.user_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={Boolean(errors.email?.message)}
                    fullWidth={true}
                    type="email"
                    label="Email"
                    variant="outlined"
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            sx={{ m: '1rem' }}
            variant="contained"
            color="inherit"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            sx={{ m: '1rem' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Create the invitation
          </Button>
        </Box>
      </form>
    </Modal>
  );
}

export default InvitationAdd;
