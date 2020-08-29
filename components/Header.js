import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const Header = () => (
  <AppBar position="relative">
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        React Playground
      </Typography>
      <Button color="inherit">Login</Button>
    </Toolbar>
  </AppBar>
)

export default Header
