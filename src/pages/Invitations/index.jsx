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
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';

import InvitationAdd from "../InvitationAdd"
import InvitationEdit from "../InvitationEdit"

function Invitations() {
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState();
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [invitationEditId, setInvitationEditId] = useState(null);


  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = (state) => { setOpenAdd(state) }
  const handleChangeAdd = (state) => { if (state) loadData() }

  const handleOpenEdit = (id) => {
    setOpenEdit(true);
    setInvitationEditId(id)
  }
  const handleCloseEdit = (state) => { 
    setOpenEdit(state)
      setInvitationEditId(null)
  }
  const handleChangeEdit = (state) => { if (state) loadData() }

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getInvitations();
      setInvitations(response.data);
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
  }, []);

  const onDelete = async (id) => {
    var result = window.confirm(`Would you like to delete the invitation?`);
    try {
      if (result) {
        await api.auth.deleteInvitation(id);
        const newInvitations = invitations.filter(invitation => id !== invitation.id)
        setInvitations(newInvitations);
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };

  const onSend = async (id) => {
    var result = window.confirm(`Would you like to send the invitation?`);
    try {
      if (result) {
        await api.auth.sendInvitation(id);
      }
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
    } finally {
    }
  };

  return (
    <Container >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <h2>Invitations</h2>
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={() => handleOpenAdd()}
        >
          <AddIcon
            className="dead-moroz-red-color"
            sx={{ fontSize: 32 }}
          />
        </IconButton>
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
              <TableCell sx={{ width: "15%" }}>Name</TableCell>
              <TableCell                      >Email</TableCell>
              <TableCell sx={{ width: "15%" }}>Expire</TableCell>
              <TableCell sx={{ width: "15%" }}>Status</TableCell>
              <TableCell sx={{ width: "20%" }}>Tools</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invitations && invitations.map((invitation, i) => (
              <TableRow
                key={invitation.id}
              >
                <TableCell
                  component="th"
                  scope="row">
                  {invitation.user_name}
                </TableCell>
                <TableCell>
                  {invitation.email}
                </TableCell>
                <TableCell>
                  {invitation.expire_at}
                </TableCell>
                <TableCell>
                  {invitation.status}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => onDelete(invitation.id)}
                  >
                    <DeleteOutlineIcon
                      sx={{ color: 'darkgray', fontSize: 24 }}
                    />
                  </IconButton>
                  {(invitation.status === "created") &&
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenEdit(invitation.id)}
                  >
                    <EditIcon
                      sx={{ color: 'darkgray', fontSize: 24 }}
                    />
                  </IconButton>}
                  <IconButton
                    aria-label="delete"
                    onClick={() => onSend(invitation.id)}
                  >
                    <SendIcon
                      sx={{ color: 'darkgray', fontSize: 24 }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {invitations && (invitations.length === 0) &&
              <TableRow>
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
      <InvitationAdd
        setStateModal={handleCloseAdd}
        setChangeTable={handleChangeAdd}
        stateOpen={openAdd} />
      <InvitationEdit
        setStateModal={handleCloseEdit}
        setChangeTable={handleChangeEdit}
        stateOpen={openEdit}
        id={invitationEditId}
      />
    </Container>
  );
}

export default Invitations;
