import React, { useState } from 'react';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FileUpload from '@mui/icons-material/AddPhotoAlternate';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import { create } from './api-product.js';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../components/auth/auth-helper.js';

const CardContainer = styled(Card)({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: '5px',
  paddingBottom: '2px',
});

const Title = styled(Typography)({
  marginTop: '2px',
  color: 'primary',
  fontSize: '1.2em',
});

const ErrorText = styled(Typography)({
  verticalAlign: 'middle',
});

const TextFieldStyled = styled(TextField)({
  marginLeft: '1px',
  marginRight: '1px',
  width: '300px',
});

const SubmitButton = styled(Button)({
  margin: 'auto',
  marginBottom: '2px',
});

const Input = styled('input')({
  display: 'none',
});

const FileName = styled('span')({
  marginLeft: '10px',
});

export const NewProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    error: '',
  });

  const navigate = useNavigate();
  const jwt = auth.isAuthenticated()

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    let productData = new FormData();
    values.name && productData.append('name', values.name);
    values.description && productData.append('description', values.description);
    values.image && productData.append('image', values.image);
    values.category && productData.append('category', values.category);
    values.quantity && productData.append('quantity', values.quantity);
    values.price && productData.append('price', values.price);

    create(
      {
        shopId: match.params.shopId,
      },
      {
        t: jwt.token,
      },
      productData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '' });
        navigate('/seller/shop/edit/' + match.params.shopId);
      }
    });
  };

  return (
    <div>
      <CardContainer>
        <CardContent>
          <Title variant="h2">New Product</Title>
          <br />
          <Input accept="image/*" onChange={handleChange('image')} id="icon-button-file" type="file" />
          <label htmlFor="icon-button-file">
            <SubmitButton variant="contained" color="secondary" component="span">
              Upload Photo
              <FileUpload />
            </SubmitButton>
          </label>{' '}
          <FileName>{values.image ? values.image.name : ''}</FileName>
          <br />
          <TextFieldStyled
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="multiline-flexible"
            label="Description"
            multiline
            rows={2}
            value={values.description}
            onChange={handleChange('description')}
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="category"
            label="Category"
            value={values.category}
            onChange={handleChange('category')}
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="quantity"
            label="Quantity"
            value={values.quantity}
            onChange={handleChange('quantity')}
            type="number"
            margin="normal"
          />
          <br />
          <TextFieldStyled
            id="price"
            label="Price"
            value={values.price}
            onChange={handleChange('price')}
            type="number"
            margin="normal"
          />
          {values.error && (
            <ErrorText component="p" color="error">
              <Icon color="error">error</Icon>
              {values.error}
            </ErrorText>
          )}
        </CardContent>
        <CardActions>
          <SubmitButton color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </SubmitButton>
          <Link to={'/seller/shop/edit/' + match.params.shopId}>
            <SubmitButton variant="contained">Cancel</SubmitButton>
          </Link>
        </CardActions>
      </CardContainer>
    </div>
  );
}
