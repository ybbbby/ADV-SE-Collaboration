import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Map from '../../components/GoogleMap/SimpleMap'
import CardMedia from '@material-ui/core/CardMedia'
import { Typography, Card, Box } from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button'
import UpdateInputModal from '../../components/UpdateInputModal/UpdateInputModal'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  Typography: {
    color: theme.palette.text.primary,
  },
  register: {
    height: '80%',
    width: '100%',
  },
  blank: {
    height: '10px',
  },
}))

export default function EventDetail({ match }) {
  const classes = useStyles()
  const isAuthor = match.params.eventID == '1' ? true : false
  const [description, setDescription] = useState(
    'asjhdflakjhsdlfkajhsdljhf lajh dsfljkhadsfjh aldsjfh lajsdh flajshdflajhds flajhds flahds lf jhasasjdfh a;kjds ;fkja;dsfk ja;sdkfj;akdsj f;al dsj;kflas;df a;lkfj ;aklsdj f;ajks df;ajs d;flajds;lfaj;dslfj aei hliuaherf liahfd vlkasdn flawker oaiudf;kjas;dkljfa;lkw3 jr;ioausdj;flkjajds;flkj a;sdlkfj ;awefh ;ioauf ;alksdj;fakjs df'
  )
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [type, setType] = useState(1)

  const handleClick = (num) => {
    setType(num)
    setOpenLogin(true)
  }
  const [openLogin, setOpenLogin] = React.useState(false)
  const handleClose = (value) => {
    setOpenLogin(false)
    if (!value) {
      return
    }
    console.log(value)
    if (type == 1) {
      setSelectedDate(value)
    } else if (type == 2) {
      setSelectedDate(value)
    } else if (type == 3) {
      setDescription(value)
    }
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardMedia
              image="https://cdn.vox-cdn.com/thumbor/lopA7fKDwAh9iqR0hqVsHWpnPfQ=/0x0:4133x3074/1820x1213/filters:focal(1737x1207:2397x1867):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65573297/GettyImages_1019226434.0.jpg"
              component="img"
              height="300"
            />
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Typography gutterBottom variant="h3">
            Party in Hells Kitchen
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid container spacing={1} justify="center">
        <Grid item xs={1}>
          <Box align="center">
            <CalendarTodayIcon />
          </Box>
          <Box align="center">
            <AccessTimeIcon />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">
            <Box textAlign="left" align="center">
              {selectedDate.toDateString()}
            </Box>
            <Box textAlign="left" align="justify">
              {selectedDate.toLocaleTimeString()}
            </Box>
          </Typography>
        </Grid>

        <Grid item xs={1}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(1)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(2)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={4}>
          {!isAuthor ? (
            <Button
              variant="contained"
              color="secondary"
              className={classes.register}
            >
              REGISTER NOW
            </Button>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.blank}></Box>
          <Box className={classes.blank}></Box>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h5">
            <Box textAlign="left" align="center">
              Details
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={10}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }} onClick={() => handleClick(3)}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            {description}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5">
            <Box textAlign="left" align="center">
              Event Location
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={9}>
          {isAuthor ? (
            <Box style={{ cursor: 'pointer' }}>
              <EditOutlinedIcon color="primary" />
            </Box>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            3252 NE 1st Ave Este, Miami, Florida
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} justify="center">
        <Grid item xs={12}>
          <Map height="100px" />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box className={classes.blank}></Box>
        <Box className={classes.blank}></Box>
      </Grid>
      <UpdateInputModal
        handleClose={handleClose}
        open={openLogin}
        type={type}
        date={selectedDate}
        description={description}
      ></UpdateInputModal>
    </div>
  )
}
