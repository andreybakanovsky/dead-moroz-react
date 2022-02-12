import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function Good() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getGood(id);
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
        <p>{data.id} | {data.year} | {data.content}</p>
      }
    </Container>
  );
}

export default Good;
