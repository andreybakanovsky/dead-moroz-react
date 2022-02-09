import React from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import Goods from "../../pages/Goods";
import Login from "../../pages/Login";
import Profile from "../../pages/Profile";
import useAuth from "../../hooks/useAuth";
import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";
import {
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";


function AppRoutes() {
  const auth = useAuth();

  return auth.isLoaded ? (
    <Routes>
      <Route path="/" element={<Goods />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  ) : (
    <Container maxWidth="md">
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <Grid item>
          <CircularProgress color="inherit" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default AppRoutes;