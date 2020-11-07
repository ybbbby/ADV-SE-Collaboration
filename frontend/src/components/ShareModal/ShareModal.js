import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  InputBase,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Link,
  ClickAwayListener,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import EmailIcon from '@material-ui/icons/Email'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const styles = (theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  socialMedia: {
    minWidth: '500px',
    textAlign: 'center',
  },
  socialIcon: {
    margin: '10px',
    height: '30px',
    width: '30px',
  },
})

const TWITTER_SHARE_LINK = 'https://twitter.com/intent/tweet?url='
const FACEBOOK_SHARE_LINK = 'https://www.facebook.com/sharer/sharer.php?u='
const EMAIL_SHARE_LINK = 'mailto:info@example.com?&subject=&body='

class ShareModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: this.props.url,
      copied: false,
    }
  }

  render() {
    const { classes } = this.props
    return (
      <>
        <DialogTitle id="form-dialog-title">Share the event</DialogTitle>
        <DialogContent>
          <div className={classes.socialMedia}>
            <Tooltip title="Share on Twitter">
              <Link
                href={TWITTER_SHARE_LINK + this.state.url}
                color="inherit"
                target="_blank"
              >
                <TwitterIcon className={classes.socialIcon} />
              </Link>
            </Tooltip>
            <Tooltip title="Share on Facebook">
              <Link
                href={FACEBOOK_SHARE_LINK + this.state.url}
                color="inherit"
                target="_blank"
              >
                <FacebookIcon className={classes.socialIcon} />
              </Link>
            </Tooltip>
            <Tooltip title="Share by Email">
              <Link href={EMAIL_SHARE_LINK + this.state.url} color="inherit">
                <EmailIcon className={classes.socialIcon} />
              </Link>
            </Tooltip>
          </div>
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder={this.state.url}
              disabled
              inputProps={{ 'aria-label': 'event sharing link' }}
            />
            <ClickAwayListener
              onClickAway={() => this.setState({ copied: false })}
            >
              <CopyToClipboard
                text={this.state.url}
                onCopy={() => this.setState({ copied: true })}
              >
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  open={this.state.copied}
                  disableFocusListener
                  disableHoverListener
                  title="Copied"
                  arrow
                >
                  <IconButton className={classes.iconButton} aria-label="copy">
                    <FileCopyIcon />
                    {this.state.copyText}
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            </ClickAwayListener>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(event) => {
              this.props.handleClose(event.target.value)
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </>
    )
  }
}

ShareModal.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ShareModal)
