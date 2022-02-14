import React, { useEffect, useState } from 'react';
import {
  Container,
} from "@mui/material";
import api from "../../services/api";

function Users() {
  const [data, setData] = useState();

  const loadData = async () => {
    try {
      const response = await api.auth.getUsers();
      setData(response.data);
    } catch (e) {
      console.log(e.response.status)
      console.log(e.response.data)
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container >
      {data && data.map(user => {
        return <p key={user.id}>{user.id} | {user.name} | {user.age}</p>;
      })}
    </Container>

  );
}

export default Users;
