import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
} from "@mui/material";

import api from "../../services/api";
import {
  useParams,
  useNavigate
} from 'react-router-dom';

function Reviews() {
  const id = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState();

  const loadData = useCallback(async () => {
    try {
      const response = await api.auth.getReviews(id);
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
      <h3>Reviews</h3>
      {data && data.map(review => {
        return <p key={review.id}>id:{review.id} | {review.comment} | grade:{review.grade} | author id: {review.user_id}</p>;
      })}
    </Container>
  );
}

export default Reviews;
