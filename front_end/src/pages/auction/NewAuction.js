import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import { styled } from '@mui/system';
import { create } from './api-auction.js';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../components/auth/auth-helper.js';

const CardContainer = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(2),
}));

const getDateString = (date) => {
  let year = date.getFullYear();
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  let dateString = `${year}-${month}-${day}T${hours}:${minutes}`;
  return dateString;
};

export const NewAuction = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const defaultStartTime = getDateString(currentDate);
  const defaultEndTime = getDateString(new Date(currentDate.setHours(currentDate.getHours() + 1)));

  const [values, setValues] = useState({
    itemName: '',
    description: '',
    image: '',
    bidStart: defaultStartTime,
    bidEnd: defaultEndTime,
    startingBid: 0,
    error: '',
  });

  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    if (values.bidEnd < values.bidStart) {
      setValues({ ...values, error: 'Auction cannot end before it starts' });
    } else {
      let auctionData = new FormData();
      values.itemName && auctionData.append('itemName', values.itemName);
      values.description && auctionData.append('description', values.description);
      values.image && auctionData.append('image', values.image);
      values.startingBid && auctionData.append('startingBid', values.startingBid);
      values.bidStart && auctionData.append('bidStart', values.bidStart);
      values.bidEnd && auctionData.append('bidEnd', values.bidEnd);
      create(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        auctionData
      ).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          navigate('/myauctions');
        }
      });
    }
  };

  return (
    <div>
      <CardContainer>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ marginTop: 2, color: (theme) => theme.palette.openTitle, fontSize: '1em' }}>
            New Auction
          </Typography>
          <br />
          <input
            accept="image/*"
            onChange={handleChange('image')}
            sx={{ display: 'none' }}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Image
              <Icon as="span" sx={{ marginLeft: 1 }}>
                add_photo_alternate
              </Icon>
            </Button>
          </label>{' '}
          <span>{values.image ? values.image.name : ''}</span>
          <br />
          <TextField
            id="name"
            label="Item Name"
            sx={{ marginLeft: 1, marginRight: 1, width: 300 }}
            value={values.itemName}
            onChange={handleChange('itemName')}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows={2}
            value={values.description}
            onChange={handleChange('description')}
            sx={{ marginLeft: 1, marginRight: 1, width: 300 }}
            margin="normal"
          />
          <br />
          <TextField
            id="startingBid"
            label="Starting Bid ($)"
            sx={{ marginLeft: 1, marginRight: 1, width: 300 }}
            value={values.startingBid}
            onChange={handleChange('startingBid')}
            margin="normal"
          />
          <br />
          <br />
          <TextField
            id="datetime-local"
            label="Auction Start Time"
            type="datetime-local"
            defaultValue={defaultStartTime}
            sx={{ marginLeft: 1, marginRight: 1, width: 300 }}
            onChange={handleChange('bidStart')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <br />
          <TextField
            id="datetime-local"
            label="Auction End Time"
            type="datetime-local"
            defaultValue={defaultEndTime}
            sx={{ marginLeft: 1, marginRight: 1, width: 300 }}
            onChange={handleChange('bidEnd')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <br />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" sx={{ verticalAlign: 'middle' }}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} sx={{ margin: 'auto', marginBottom: 2 }}>
            Submit
          </Button>
          <Link to="/myauctions" sx={{ margin: 'auto' }}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </CardContainer>
    </div>
  );
};
