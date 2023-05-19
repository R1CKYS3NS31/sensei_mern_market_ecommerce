import React from 'react'
import styled from '@emotion/styled'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
// import unicornbikeImg from '/assets/images/unicornbike.jpg'


const card = styled('div')({
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme => theme.spacing(5),
  marginBottom: theme => theme.spacing(5),
});

const title = styled('div')({
  padding: theme => `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
  color: theme => theme.palette.openTitle,
});

const media = styled('div')({
  minHeight: 400,
});

const credit = styled('div')({
  padding: 10,
  textAlign: 'right',
  backgroundColor: '#ededed',
  borderBottom: '1px solid #d0d0d0',
  '& a':{
    color: '#3f4771',
  },
});

const useStyles = () => ({ card, title, media, credit });

export const Home = () => {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <Typography variant="h2" className={classes.title}>
        Home Page
      </Typography>
      <CardMedia className={classes.media} image={'https://source.unsplash.com/random'} title="Unicorn Bicycle" />
      
      <CardContent>
        <Typography variant="body1" component="p">
          Welcome to the sensie MERN setup home page.
        </Typography>
      </CardContent>
    </Card>
  )
}
