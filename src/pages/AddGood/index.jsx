import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
  Typography,
  Button,
  TextField,
} from "@mui/material";
import {
  useParams,
  useNavigate,
} from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

const style = {
  position: 'absolute',
  top: '31%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddGood = (props) => {
  const id = useParams();
  const handleClose = () => props.setStateModal(false)
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const navigate = useNavigate();
  const auth = useAuth();

  const onGoods = () => {
    navigate(`/users/${auth.user.id}/goods`);
  };

  const onSubmit = async (data) => {
    if (data.content === '') {
      setError("content", {
        type: "manual",
        message: "good is empty",
      });
      return;
    }
    try {
      console.log("id", id);
      console.log("data", data);
      await api.auth.addGood(id, { "good": data });
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
      onGoods();
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Let's show {new Date().getFullYear()}'s good ;)
          </Typography>
          <Controller
            name="year"
            control={control}
            defaultValue={new Date().getFullYear()}
            render={({ field }) => (
              <TextField
                {...field}
                error={Boolean(errors.year?.message)}
                fullWidth={true}
                label="year"
                variant="outlined"
                style={{ display: "none" }}
                helperText={errors.year?.message}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ mt: '1rem' }}
                multiline
                rows={5}
                error={Boolean(errors.content?.message)}
                fullWidth={true}
                label="My good"
                variant="outlined"
                helperText={errors.content?.message}
              />
            )}
          />
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
            Add
          </Button>
        </Box>
      </form>
    </Modal>

  );

}

export default AddGood;
