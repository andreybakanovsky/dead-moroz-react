import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import {
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";
import PrivateRoute from "../components/PrivateRoute";
import GuestRoute from "../components/GuestRoute";

import Home from "../../pages/Home";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
import Profile from "../../pages/Profile";
import Karma from "../../pages/Karma";
import NotFound from "../../pages/NotFound";

import Users from "../../pages/Users";
import User from "../../pages/User";
import Goods from "../../pages/Goods";
import Good from "../../pages/Good";
import RequestedGifts from "../../pages/RequestedGifts";
import RequestedGift from "../../pages/RequestedGift";

import Reviews from "../../pages/Reviews";
import Review from "../../pages/Review";
import SuggestedGifts from "../../pages/SuggestedGifts";
import SuggestedGift from "../../pages/SuggestedGift";

import Statistics from "../../pages/Statistics";

function AppRoutes() {
  const auth = useAuth();

  return auth.isLoaded ? (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={<GuestRoute> <Login /> </GuestRoute>}
      />
      <Route
        path="/signup"
        element={<GuestRoute> <Signup /> </GuestRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute> <Profile /> </PrivateRoute>}
      />
      <Route
        path="/karma"
        element={<PrivateRoute> <Karma /> </PrivateRoute>}
      />

      <Route path="users">
        <Route
          path=""
          element={<PrivateRoute> <Users /> </PrivateRoute>}
        />
        <Route
          path=":user_id"
          element={<PrivateRoute> <User /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods"
          element={<PrivateRoute> <Goods /> </PrivateRoute>}
        />
        <Route
          path=":user_id/statistics"
          element={<PrivateRoute> <Statistics /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id"
          element={<PrivateRoute> <Good /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/gifts"
          element={<PrivateRoute> <RequestedGifts /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/gifts/:id"
          element={<PrivateRoute> <RequestedGift /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/reviews"
          element={<PrivateRoute> <Reviews /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/reviews/:review_id"
          element={<PrivateRoute> <Review /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/reviews/:review_id/gifts"
          element={<PrivateRoute> <SuggestedGifts /> </PrivateRoute>}
        />
        <Route
          path=":user_id/goods/:good_id/reviews/:review_id/gifts/:id"
          element={<PrivateRoute> <SuggestedGift /> </PrivateRoute>}
        />
      </Route>

      <Route path="/not-found-404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found-404" />} />
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