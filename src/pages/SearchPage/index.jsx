import React, { useRef, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper
} from "@mui/material";
import Typography from '@mui/material/Typography';

import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import parse, { domToReact } from 'html-react-parser';
import {
  Navigate,
} from 'react-router-dom';


function SearchPage() {
  const searchRef = useRef(null);
  const auth = useAuth();
  const [results, setResults] = useState(null);
  const [queryString, setQueryString] = useState();

  useEffect(() => {
    if (searchRef !== null) searchRef.current.focus();
  }, []);

  const search = async () => {
    if (queryString !== null) {
      try {
        const response = await api.auth.search(queryString);
        setResults(response.data);
        console.log(response.data);
      } catch (e) {
        console.log(e.response.status);
        console.log(e.response.data);
      }
    }
  }

  const highlightStyle = {
    color: "#2c8610",
    fontWeight: 'bold'
  }

  const options = {
    replace: ({ attribs, children }) => {
      if (!attribs) {
        return;
      }
      return (
        <span style={highlightStyle}>
          {domToReact(children, options)}
        </span>
      );
    }
  };

  const getHighlightedText = (obj) => {
    let arr = []
    Object.values(obj.highlight).map((parts) => {
      parts.map((part, i, { length }) => {
        arr.push(parse(part, options));
        if (i + 1 !== length) arr.push(' ... ');
        if (part.last) console.log("last part ", part);
      }
      )
    })
    return arr
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getDate = (date) => {
    const postDate = new Date(date);
    return postDate.toLocaleDateString('en-US',)
  }

  return (
    ((auth.user.role === "dead_moroz") || (auth.user.role === "elf")) ?
      <Container >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Paper
            component="form"
            sx={{ m: 2, p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
          >
            <InputBase
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  search();
                  e.preventDefault();
                }
              }}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search ..."
              inputProps={{ 'aria-label': 'search gifts' }}
              inputRef={searchRef}
              onChange={e => setQueryString(e.target.value)}
            />
            <IconButton
              onClick={() => search()}
              sx={{ p: '10px' }}
              aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>

        </Grid>
        {results && (results.gifts != undefined) && results.gifts.map((gift) => (
          <Paper
            key={gift._id}
            sx={{
              m: 4,
              p: 2,
              margin: 1,
              maxWidth: 'auto',
              flexGrow: 1
            }}
          >
            <Typography
              className="dead-moroz-red-color"
              variant="h6"
              gutterBottom
            >
              {capitalizeFirstLetter(gift._index)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {getDate(gift._source.updated_at)} - {getHighlightedText(gift)}
            </Typography>
            <Typography variant="body2" gutterBottom>
            </Typography>
          </Paper>
        ))}
      </Container>
      :
      <Navigate to={"/not-found-404"} />
  );
}

export default SearchPage;
