import React, { useRef, useState } from 'react';
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
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

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

const AddGood = (props) => {
  const id = useParams();
  const handleClose = () => {
    props.setStateModal(false)
    setFilesSuggested(undefined);
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
  const navigate = useNavigate();
  const auth = useAuth();

  const onGoods = () => {
    navigate(`/users/${auth.user.id}/goods`);
  };
  const inputFile = useRef(null);
  const [filesSuggested, setFilesSuggested] = useState();

  const onSubmit = async (data) => {
    if (data.content === '') {
      setError("content", {
        type: "manual",
        message: "good is empty",
      });
      return;
    }

    const formData = new FormData();

    try {
      formData.append('good[year]', data.year);
      formData.append('good[content]', data.content);
      if (filesSuggested) {
        for (let i = 0; i < filesSuggested.length; i++) {
          formData.append("good[images][]", filesSuggested[i], filesSuggested[i].name)
        }
      }
      await api.auth.addGood(id, formData);
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
      reset();
    }
  };

  const onCancel = () => {
    handleClose();
  };

  const openFileDialog = () => {
    inputFile.current.click();
  };

  const changeHandler = (e) => {
    const chosenfiles = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      chosenfiles.push(files[i]);
    }
    setFilesSuggested(chosenfiles);
  }

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
          {(filesSuggested) ? (
            < ImageList sx={{ width: "auto", height: 220 }} rowHeight={200} variant="masonry">
              {filesSuggested && filesSuggested.map((file, i) => {
                return (
                  <ImageListItem key={i}>
                    <img
                      src={URL.createObjectURL(file)}
                      srcSet={URL.createObjectURL(file)}
                      alt={"photo... "}
                      loading="lazy"
                    />
                  </ImageListItem>)
              })}
            </ImageList>) : null}
          <Button
            sx={{ m: '1rem' }}
            variant="contained"
            color="inherit"
            onClick={onCancel}
          >
            Cancel
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
            variant="outlined"
            startIcon={<AddAPhotoIcon />}
            onClick={openFileDialog}
          >
            Upload
          </Button>
          <Button
            sx={{ m: '1rem' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Add the good
          </Button>
        </Box>
      </form>
    </Modal>
  );
}

export default AddGood;
