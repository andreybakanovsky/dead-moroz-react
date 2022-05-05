import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Grid,

} from "@mui/material";
import api from "../../services/api";
import {
  useNavigate
} from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Invitations() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getInvitations();
      setInvitations(response.data);
      console.log(response.data)
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
      if (e.response.status === 404) {
        navigate("/not-found-404");
      }
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Invitations</h2>
      </Grid>
      <Paper
        sx={{
          m: 4,
          p: 2,
          margin: 1,
          maxWidth: 'auto',
          flexGrow: 1
        }}
      >
        <Table size="small" aria-label="approvedGifts">
          <TableHead
            sx={{ backgroundColor: "#f5f0f0" }}
          >
            <TableRow>
              <TableCell sx={{ width: "10%" }}>Name</TableCell>
              <TableCell sx={{ width: "20%" }}>Email</TableCell>
              <TableCell > Url</TableCell>
              <TableCell sx={{ width: "10%" }}>Exipre</TableCell>
              <TableCell sx={{ width: "10%" }} >Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations && invitations.map((invitation, i) => (
              <TableRow
                key={invitation.id}
              >
                <TableCell
                  sx={{ verticalAlign: 'top' }}
                  component="th"
                  scope="row">
                  {invitation.email}
                </TableCell>
                <TableCell
                  sx={{ verticalAlign: 'top' }}>
                  {invitation.email}
                </TableCell>
                <TableCell
                  sx={{ verticalAlign: 'top' }}>
                  {invitation.url}
                </TableCell>
                <TableCell
                  sx={{ verticalAlign: 'top' }}>
                  {invitation.expire_at}
                </TableCell>
                <TableCell
                  sx={{ verticalAlign: 'top' }}>
                  {invitation.status}
                </TableCell>
              </TableRow>
            ))}
            {invitations && (invitations.length === 0) &&
              <TableRow>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
                <TableCell align="left" >
                  there are no invitations
                </TableCell>
                <TableCell > </TableCell>
                <TableCell > </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>

      </Paper>
    </Container>
  );
}

export default Invitations;
