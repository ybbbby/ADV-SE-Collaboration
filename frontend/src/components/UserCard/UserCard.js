import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Avatar, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import LoginModal from '../LoginModal/LoginModal'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: '10px auto',
    width: theme.spacing(9),
    height: theme.spacing(9),
  },
  username: {
    fontSize: 18,
  },
  email: {
    fontSize: 14,
    marginBottom: theme.spacing(1.5),
  },
  link: {
    textDecoration: 'none',
  },
}))

function UserCard(props) {
  const classes = useStyles()
  const { isLogin, data } = props
  const [openLogin, setOpenLogin] = React.useState(false)

  return (
    <>
      {isLogin ? (
        <>
          <Avatar className={classes.avatar} src={data['picture']} />
          <Typography className={classes.username}>{data['name']}</Typography>
          <Typography className={classes.email} color="textSecondary">
            {data['email']}
          </Typography>
          <Link to="/newevent" className={classes.link}>
            <Button variant="outlined" color="primary">
              Create event
            </Button>
          </Link>
        </>
      ) : (
        <>
          <Avatar className={classes.avatar} />
          <Button color="inherit" onClick={() => setOpenLogin(true)}>
            Login
          </Button>
          <LoginModal
            handleClose={() => setOpenLogin(false)}
            open={openLogin}
          />
        </>
      )}
    </>
  )
}

UserCard.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
}

export default UserCard
