import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function RequestedGifts() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getRequestedGifts(id);
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
      <h3>Requested gifts</h3>
      {data && data.map(requestedGifts => {
        return <p key={requestedGifts.id}>id:{requestedGifts.id} | name:{requestedGifts.name} | description:{requestedGifts.description}</p>;
      })}
    </Container>
  );
}

export default RequestedGifts;
