import React, { useEffect, useState } from 'react';
import { Card, CardActions, CardContent, Button, TextField, Typography, Icon, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import { read, update } from './api-auction';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import auth from '../../components/auth/auth-helper';

const Root = styled('div')({
  flexGrow: 1,
  margin: 30,
});

const StyledCard = styled(Card)({
  textAlign: 'center',
  paddingBottom: '16px',
});

const Title = styled(Typography)({
  margin: '16px',
  color: '#00bcd4',
  fontSize: '1.2em',
});

const Subheading = styled(Typography)({
  marginTop: '16px',
  color: '#616161',
});

export const EditAuction = ({ match }) => {
  const navigate = useNavigate();
  const [auction, setAuction] = useState({
    itemName: '',
    description: '',
    image: '',
    bidStart: '',
    bidEnd: '',
    startingBid: 0,
  });
  const [error, setError] = useState('');

  const getDateString = (date) => {
    let year = date.getFullYear();
    let day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
    let month = date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes();
    let dateString = `${year}-${month}-${day}T${hours}:${minutes}`;
    return dateString;
  };

  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({
      auctionId: match.params.auctionId,
    }, signal).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        data.bidEnd = getDateString(new Date(data.bidEnd));
        data.bidStart = getDateString(new Date(data.bidStart));
        setAuction(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const clickSubmit = () => {
    if (auction.bidEnd < auction.bidStart) {
      setError('Auction cannot end before it starts');
    } else {
      let auctionData = new FormData();
      auction.itemName && auctionData.append('itemName', auction.itemName);
      auction.description && auctionData.append('description', auction.description);
      auction.image && auctionData.append('image', auction.image);
      auction.startingBid && auctionData.append('startingBid', auction.startingBid);
      auction.bidStart && auctionData.append('bidStart', auction.bidStart);
      auction.bidEnd && auctionData.append('bidEnd', auction.bidEnd);

      update({
        auctionId: match.params.auctionId,
      }, {
        t: jwt.token,
      }, auctionData).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate('/myauctions');
        }
      });
    }
  };

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setAuction({ ...auction, [name]: value });
  };

  const logoUrl = auction._id
    ? `/api/auctions/image/${auction._id}?${new Date().getTime()}`
    : '/api/auctions/defaultphoto';

  return (
    <Root>
      <StyledCard>
        <CardContent>
          <Title type="headline" component="h2">
            Edit Auction
          </Title>
          <br />
          <Avatar src={logoUrl} /><br />
          <input accept="image/*" onChange={handleChange('image')} id="icon-button-file" type="file" style={{ display: 'none' }} />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="default" component="span">
              Change Image
              <AddPhotoAlternateIcon />
            </Button>
          </label> <span>{auction.image ? auction.image.name : ''}</span><br />
          <TextField id="name" label="Name" value={auction.itemName} onChange={handleChange('itemName')} margin="normal" /><br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="3"
            value={auction.description}
            onChange={handleChange('description')}
            margin="normal"
          /><br />
          <TextField id="startingBid" label="Starting Bid ($)" value={auction.startingBid} onChange={handleChange('startingBid')} margin="normal" /><br />
          <br />
          <TextField
            id="datetime-local"
            label="Auction Start Time"
            type="datetime-local"
            value={auction.bidStart}
            onChange={handleChange('bidStart')}
            InputLabelProps={{
              shrink: true,
            }}
          /><br />
          <br />
          <TextField
            id="datetime-local"
            label="Auction End Time"
            type="datetime-local"
            value={auction.bidEnd}
            onChange={handleChange('bidEnd')}
            InputLabelProps={{
              shrink: true,
            }}
          /><br /> <br />
          {error && (
            <Typography component="p" color="error">
              <Icon color="error">error</Icon>
              {error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}>
            Update
          </Button>
        </CardActions>
      </StyledCard>
    </Root>
  );
}
