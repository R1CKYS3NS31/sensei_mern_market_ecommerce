import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { list } from './api-product.js';
import styled from '@mui/material/styles/styled';
import { Products } from './Products.js';

const CardContainer = styled(Card)(({ theme }) => ({
  margin: 'auto',
  textAlign: 'center',
  paddingTop: 10,
  backgroundColor: '#80808024',
}));

const MenuTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 130,
  verticalAlign: 'bottom',
  marginBottom: '20px',
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 300,
  marginBottom: '20px',
}));

const SearchButton = styled(Button)(({ theme }) => ({
  minWidth: '20px',
  height: '30px',
  padding: '0 8px',
  marginBottom: '20px',
}));

export const Search = (props) => {
  const [values, setValues] = useState({
    category: '',
    search: '',
    results: [],
    searched: false,
  });

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };

  const search = () => {
    if (values.search) {
      list({
        search: values.search || undefined,
        category: values.category,
      }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, results: data, searched: true });
        }
      });
    }
  };

  const enterKey = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      search();
    }
  };

  return (
    <div>
      <CardContainer>
        <MenuTextField
          id="select-category"
          select
          label="Select category"
          value={values.category}
          onChange={handleChange('category')}
          SelectProps={{
            MenuProps: {
              className: 'menu',
            },
          }}
          margin="normal"
        >
          <MenuItem value="All">All</MenuItem>
          {props.categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </MenuTextField>
        <SearchTextField
          id="search"
          label="Search products"
          type="search"
          onKeyDown={enterKey}
          onChange={handleChange('search')}
          margin="normal"
        />
        <SearchButton variant="contained" color="primary" onClick={search}>
          <SearchIcon />
        </SearchButton>
        <Divider />
        <Products products={values.results} searched={values.searched} />
      </CardContainer>
    </div>
  );
};

Search.propTypes = {
  categories: PropTypes.array.isRequired,
};
