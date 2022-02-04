import * as React from 'react';
import UsersList from "./context/UsersList";
import Login from "./context/Login";
import Header from './components/Header';
import { Grid, AppBar, IconButton, Toolbar, Typography, CssBaseline, Container } from "@mui/material";

function App() {
  return (
    <div className="App">

      <Header />

      <Grid
        container
        direction="column"
        alignItems="center"
        // justifyContent="center"

        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={6}>
          <Login />
        </Grid>

      </Grid>




      {/* <UsersList /> */}
    </div >
  );
}

export default App;
