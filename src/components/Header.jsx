import * as React from 'react';
import { AppBar, IconButton, Toolbar, Typography, CssBaseline, Container, Button } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Header = () => {
    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar position="sticky">
                <Container maxWidth="lg">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color='inherit'
                        >
                            <AutoAwesomeIcon />
                        </IconButton>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                            Dead Moroz
                        </Typography>
                        <Button
                            // endIcon={<LoginIcon />}
                            color="inherit"
                        >
                            LOGIN
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </React.Fragment>
    )
}

export default Header;