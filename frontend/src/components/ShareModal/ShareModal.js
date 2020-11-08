import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Link,
  ClickAwayListener,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'
import EmailIcon from '@material-ui/icons/Email'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles((theme) => ({
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
}))

const TWITTER_SHARE_LINK = 'https://twitter.com/intent/tweet?url='
const FACEBOOK_SHARE_LINK = 'https://www.facebook.com/sharer/sharer.php?u='
const EMAIL_SHARE_LINK = 'mailto:info@example.com?&subject=&body='

function ShareModal(props) {
  const classes = useStyles()
  const { url, handleClose, open } = props
  const [copied, setCopied] = React.useState(false)

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Share the event</DialogTitle>
      <DialogContent>
        <div className={classes.socialMedia}>
          <Tooltip title="Share on Twitter">
            <Link
              href={TWITTER_SHARE_LINK + url}
              color="inherit"
              target="_blank"
            >
              <TwitterIcon className={classes.socialIcon} />
            </Link>
          </Tooltip>
          <Tooltip title="Share on Facebook">
            <Link
              href={FACEBOOK_SHARE_LINK + url}
              color="inherit"
              target="_blank"
            >
              <FacebookIcon className={classes.socialIcon} />
            </Link>
          </Tooltip>
          <Tooltip title="Share by Email">
            <Link href={EMAIL_SHARE_LINK + url} color="inherit">
              <EmailIcon className={classes.socialIcon} />
            </Link>
          </Tooltip>
        </div>
        <Paper className={classes.root}>
          <InputBase
            className={classes.input}
            placeholder={url}
            disabled
            inputProps={{ 'aria-label': 'event sharing link' }}
          />
          <ClickAwayListener onClickAway={() => setCopied(false)}>
            <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                open={copied}
                disableFocusListener
                disableHoverListener
                title="Copied"
                arrow
              >
                <IconButton className={classes.iconButton} aria-label="copy">
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            </CopyToClipboard>
          </ClickAwayListener>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ShareModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
}

export default ShareModal
