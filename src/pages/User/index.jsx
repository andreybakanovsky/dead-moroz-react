import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";
import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function User() {
  const [data, setData] = useState();
  let id = useParams();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getUser(id);
      setData(response.data);
    } catch (e) {
      console.log(e.response.status);
      console.log(e.response.data);
      if (e.response.status === 404) {
        navigate("/not-found-404");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Container >
      {data &&
        <div>
          <h2> {data.name} </h2>
          <h3> Age: {data.age} </h3>
        </div>}
    </Container>
  );
}

export default User;
