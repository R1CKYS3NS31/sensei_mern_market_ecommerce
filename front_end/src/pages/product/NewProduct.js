import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FileUpload from '@mui/icons-material/AddPhotoAlternate';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/material/styles';
import { create } from './api-product.js';
import { Link, useNavigate } from 'react-router-dom';

const CardContainer = styled(Card)({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme => theme.spacing(5),
  paddingBottom: theme => theme.spacing(2),
});

const ErrorMessage = styled(Typography)({
  verticalAlign: 'middle',
});

const Title = styled(Typography)({
  marginTop: theme => theme.spacing(2),
  color: theme => theme.palette.openTitle,
  fontSize: '1.2em',
});

const TextFieldContainer = styled(TextField)({
  marginLeft: theme => theme.spacing(1),
  marginRight: theme => theme.spacing(1),
  width: 300,
});

const SubmitButton = styled(Button)({
  margin: 'auto',
  marginBottom: theme => theme.spacing(2),
});

const Input = styled('input')({
  display: 'none',
});

const FileName = styled('span')({
  marginLeft: '10px',
});

export const NewProduct = ({ match }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    redirect: false,
    error: '',
  });

  const handleChange = name => event => {
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
    ).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: '', redirect: true });
      }
    });
  };

  if (values.redirect) {
    navigate('/seller/shop/edit/' + match.params.shopId);
  }

  return (
    <div>
      <CardContainer>
        <CardContent>
          <Title type="headline" component="h2">
            New Product
          </Title>
          <br />
          <Input
            accept="image/*"
            onChange={handleChange('image')}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Photo
              <FileUpload />
            </Button>
          </label>{' '}
          <FileName>{values.image ? values.image.name : ''}</FileName>
          <br />
          <TextFieldContainer
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextFieldContainer
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange('description')}
            margin="normal"
          />
          <br />
          <TextFieldContainer
            id="category"
            label="Category"
            value={values.category}
            onChange={handleChange('category')}
            margin="normal"
          />
          <br />
          <TextFieldContainer
            id="quantity"
            label="Quantity"
            value={values.quantity}
            onChange={handleChange('quantity')}
            type="number"
            margin="normal"
          />
          <br />
          <TextFieldContainer
            id="price"
            label="Price"
            value={values.price}
            onChange={handleChange('price')}
            type="number"
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <SubmitButton color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </SubmitButton>
          <Link to={'/seller/shop/edit/' + match.params.shopId} className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </CardContainer>
    </div>
  );
};
