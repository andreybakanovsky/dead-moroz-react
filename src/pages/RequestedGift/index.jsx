import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function RequestedGift() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getRequestedGift(id);
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
      <h3>Requested gift</h3>
      {data &&
        <p key={data.id}>id:{data.id} | name:{data.name} | description:{data.description}</p>
      }
    </Container>
  );
}

export default RequestedGift;
