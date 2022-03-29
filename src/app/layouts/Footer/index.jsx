import * as React from 'react';
import {
  AppBar,
  Grid,
  Toolbar,
  CssBaseline,
  Container,
} from "@mui/material";
import useAuth from "../../../hooks/useAuth";

const Footer = () => {

  const auth = useAuth();

  return (
    <React.Fragment>
      <CssBaseline />
      {auth.isLoaded &&
        (auth.user ? (
          <AppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
            <Container maxWidth="lg">
        
            </Container>
          </AppBar>
        ) : (
          <></>
        ))}
    </React.Fragment>
  )
}

export default Footer;