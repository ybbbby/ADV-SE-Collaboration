import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import App from './App'
import theme from './theme'
import g from './global'
import GoEasy from 'goeasy'

g.goEasy = new GoEasy({
  host: 'hangzhou.goeasy.io',
  appkey: 'BC-718ddbf6f6ef4fb5a6b0f6cb62814fc8',
  onConnected: function () {
    console.log('web socket connected')
  },
  onDisconnected: function () {
    console.log('web socket disconnected')
  },
  onConnectFailed: function () {
    console.log('web socket connection failed')
  },
})

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.querySelector('#root')
)
