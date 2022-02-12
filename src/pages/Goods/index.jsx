import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import { 
  useParams,
  useNavigate } from 'react-router-dom';

function Goods() {
  let id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getGoods(id);
      setData(response.data);
      console.log(response.data);
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
      {data && data.map(good => {
        return <p key={good.id}>{good.id} | {good.year} | {good.content}</p>;
      })}
    </Container>
  );
}

export default Goods;
