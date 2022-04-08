import React, { useRef, useState, useCallback, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema from "./validation";
import api from "../../services/api";
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

const GiftEditSuggestion = (props) => {
  const inputFile = useRef(null);
  const [filesSuggested, setFilesSuggested] = useState(null);
  const [filesCurrent, setFilesCurrent] = useState(null);

  const handleClose = () => {
    props.setStateModal(false)
    setFilesSuggested(null);
    setFilesCurrent(null);
    reset({
      name: '',
      description: ''
    });
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
    const formData = new FormData();

    try {
      formData.append('gift_suggestion[name]', data.name);
      formData.append('gift_suggestion[description]', data.description);
      if (filesSuggested) {
        for (let i = 0; i < filesSuggested.length; i++) {
          formData.append("gift_suggestion[images][]", filesSuggested[i], filesSuggested[i].name)
        }
      }
      await api.auth.updateSuggestedGift(props.ids, formData);
      props.setChangeTable(true);
    } catch (e) {
      if (e.response.status === 422) {
        props.setChangeTable(false);
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
    props.setChangeTable(false);
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
    setFilesCurrent(null);
    setFilesSuggested(chosenfiles);
  }

  const loadData = useCallback(async (ids) => {
    if (ids === null) return;
    const { data } = await api.auth.getSuggestedGift(ids);
    setFilesCurrent(data.images);
    reset({
      name: data.name,
      description: data.description
    });
  }, [reset]);

  useEffect(() => {
    loadData(props.ids);
  }, [props.ids]);

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
            Edit the gift
          </Typography>
          <Controller
            name="name"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={Boolean(errors.name?.message)}
                fullWidth={true}
                label="name"
                variant="outlined"
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                sx={{ mt: '1rem' }}
                multiline
                rows={5}
                error={Boolean(errors.description?.message)}
                fullWidth={true}
                label="description"
                variant="outlined"
                helperText={errors.description?.message}
              />
            )}
          />
          < ImageList sx={{ width: "auto", height: 220 }} rowHeight={200} variant="masonry">

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
            name='image-uploader'
            id="image-uploader"
            onInput={(e) => changeHandler(e)}
            accept="image/*"
            value=''
          />
          <Button
            variant="outlined"
            startIcon={<AddAPhotoIcon />}
            onClick={openFileDialog}
          >
          </Button>
          <Button
            sx={{ m: '1rem' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </form>
    </Modal>
  );
}

export default GiftEditSuggestion;
