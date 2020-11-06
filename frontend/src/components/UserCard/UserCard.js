import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Typography, Card, CardContent, Avatar } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { deepOrange } from '@material-ui/core/colors'

const styles = (theme) => ({
  root: {
    textAlign: 'center',
    borderRadius: 0,
    boxShadow:
      '0px 0px 0px -1px rgba(0,0,0,0.2), -2px -1px 1px -1px rgba(0,0,0,0.14), 0px 1px 4px 1px rgba(0,0,0,0.12);',
  },
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
  },
})

class UserCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullname: '',
      email: '',
      avatar: '',
    }
  }

  componentWillMount() {
    fetch('/userinfo', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          fullname: data['name'],
          email: data['email'],
          avatar: data['picture'],
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  render() {
    const { classes } = this.props
    return (
      <Card className={classes.root}>
        <CardContent>
          <Avatar className={classes.avatar} src={this.state.avatar} />
          <Typography className={classes.username}>
            {this.state.fullname}
          </Typography>
          <Typography className={classes.email} color="textSecondary">
            {this.state.email}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

UserCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UserCard)
