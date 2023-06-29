import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Categories } from './product/Categories';
import { Search } from './product/Search';
import { listCategories, listLatest } from './product/api-product';
import { Suggestions } from './product/Suggestions';
import { styled } from '@mui/material';

const RootContainer = styled('div')({
  flexGrow: 1,
  margin: 30,
});

export const Home = () => {
  const [suggestionTitle, setSuggestionTitle] = useState('Latest Products');
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listLatest(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setSuggestions(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listCategories(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategories(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <RootContainer>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Suggestions products={suggestions} title={suggestionTitle} />
        </Grid>
      </Grid>
    </RootContainer>
  );
}
