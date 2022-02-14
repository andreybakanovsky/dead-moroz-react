import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function SuggestedGifts() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getSuggestedGifts(id);
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
      <h3>Suggested gifts</h3>
      {data && data.map(suggestedGifts => {
        return <p key={suggestedGifts.id}>id:{suggestedGifts.id} | name:{suggestedGifts.name} | description:{suggestedGifts.description}</p>;
      })}
    </Container>
  );
}

export default SuggestedGifts;
