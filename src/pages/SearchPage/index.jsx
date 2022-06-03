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
import Link from '@mui/material/Link';

function SearchPage() {
  const searchRef = useRef(null);
  const auth = useAuth();
  const [searchResults, setSearchResults] = useState();
  const [queryString, setQueryString] = useState();

  useEffect(() => {
    if (searchRef.current !== null) searchRef.current.focus();
  }, []);

  const search = async () => {
    if (queryString !== null) {
      try {
        const response = await api.auth.search(queryString);
        setSearchResults(response.data)
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
    let searchedPartsInRecord = []
    Object.values(obj.highlight).map((parts) => {
      parts.map((part, i, { length }) => {
        searchedPartsInRecord.push(parse(part, options));
        if (i + 1 !== length) searchedPartsInRecord.push(' ... ');
      })
    })
    return searchedPartsInRecord
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getDate = (date) => {
    const postDate = new Date(date);
    return postDate.toLocaleDateString('en-US',)
  }

  return (
    !((auth.user.role === "dead_moroz") || (auth.user.role === "elf")) ?
      <Navigate to={"/not-found-404"} />
      :
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
        {searchResults && (searchResults != undefined) && searchResults.map((result, i) => (
          <Paper
            key={i}
            sx={{
              m: 4,
              pl: 3,
              pr: 3,
              pb: 1,
              pt: 1,
              margin: 1,
              maxWidth: 'auto',
              flexGrow: 1
            }}
          >
            <Typography
              className="dead-moroz-red-color"
              variant="h6"
            >
              {capitalizeFirstLetter(result._index)}
            </Typography>
            <div>
              <Link
                href={`/${result._index}/${result._id}`}>
                {`/${result._index}/${result._id}`}
              </Link>
            </div>
            <Typography
              className="dead-moroz-gray-color"
              variant="body2"
              gutterBottom
              style={{ display: 'inline' }}
            >
              {getDate(result._source.updated_at)} {` - `}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              style={{ display: 'inline' }}
            >
              {getHighlightedText(result)}
            </Typography>
          </Paper>
        ))}
      </Container>
  );
}

export default SearchPage;
