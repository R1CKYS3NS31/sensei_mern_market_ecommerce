import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';
import FileUpload from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/system';
import { read, update } from './api-product.js';
import { Link, useNavigation } from 'react-router-dom';
import auth from '../../components/auth/auth-helper.js';

const CardWrapper = styled(Card)(({ theme }) => ({
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  maxWidth: 500,
  paddingBottom: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  color: theme.palette.protectedTitle,
  fontSize: '1.2em',
}));

const Error = styled(Icon)(({ theme }) => ({
  verticalAlign: 'middle',
}));

const TextFieldWrapper = styled(TextField)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
  width: 400,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  marginBottom: theme.spacing(2),
}));

const BigAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  margin: 'auto',
}));

const Input = styled('input')({
  display: 'none',
});

const FileName = styled('span')({
  marginLeft: '10px',
});

export const EditProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    error: '',
  });

  const navigation = useNavigation();
  const jwt = auth.isAuthenticated();
  
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read(
      {
        productId: match.params.productId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          description: data.description,
          category: data.category,
          quantity: data.quantity,
          price: data.price,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  
  const clickSubmit = () => {
    let productData = new FormData();
    values.name && productData.append('name', values.name);
    values.description && productData.append('description', values.description);
    values.image && productData.append('image', values.image);
    values.category && productData.append('category', values.category);
    values.quantity && productData.append('quantity', values.quantity);
    values.price && productData.append('price', values.price);

    update(
      {
        shopId: match.params.shopId,
        productId: match.params.productId,
      },
      {
        headers: { Authorization: 'Bearer ' + jwt.token },
        body: productData,
      }
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        navigation.navigate('/seller/shop/edit/' + match.params.shopId);
      }
    });
  };
  
  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  
  const imageUrl = values.id
    ? `/api/product/image/${values.id}?${new Date().getTime()}`
    : '/api/product/defaultphoto';
  
  return (
    <div>
      <CardWrapper>
        <CardContent>
          <Title type="headline" component="h2">
            Edit Product
          </Title>
          <br />
          <BigAvatar src={imageUrl} />
          <br />
          <Input
            accept="image/*"
            onChange={handleChange('image')}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Change Image
              <FileUpload />
            </Button>
          </label>{' '}
          <FileName>{values.image ? values.image.name : ''}</FileName>
          <br />
          <TextFieldWrapper
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextFieldWrapper
            id="multiline-flexible"
            label="Description"
            multiline
            rows="3"
            value={values.description}
            onChange={handleChange('description')}
            margin="normal"
          />
          <br />
          <TextFieldWrapper
            id="category"
            label="Category"
            value={values.category}
            onChange={handleChange('category')}
            margin="normal"
          />
          <br />
          <TextFieldWrapper
            id="quantity"
            label="Quantity"
            value={values.quantity}
            onChange={handleChange('quantity')}
            type="number"
            margin="normal"
          />
          <br />
          <TextFieldWrapper
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
              <Error color="error" />
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <SubmitButton color="primary" variant="contained" onClick={clickSubmit}>
            Update
          </SubmitButton>
          <Link to={'/seller/shops/edit/' + match.params.shopId}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </CardWrapper>
    </div>
  );
};
