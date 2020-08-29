import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  descriptor: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingLeft: props => theme.spacing(2) * props.depth,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
    flexGrow: 1,
  },
  text: {
    marginLeft: theme.spacing(1),
    userSelect: 'none',
  },
}))

const FileHeader = ({ depth, icon, text, onClick }) => {
  const classes = useStyles({ depth })
  return (
    <Box display="flex" justifyContent="space-between" onClick={onClick}>
      <Box display="flex" alignItems="center" className={classes.descriptor}>
        {icon}
        <Typography className={classes.text}>
          {text}
        </Typography>
      </Box>
    </Box>
  )
}

FileHeader.propTypes = {
  depth: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default FileHeader
