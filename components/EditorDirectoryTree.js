import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CodeIcon from '@material-ui/icons/Code'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import Directory from './Directory'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 300,
  },
  titleContainer: {
    padding: theme.spacing(1),
  },
  title: {
    fontWeight: theme.typography.fontWeightMedium,
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
  margin: {
    marginRight: theme.spacing(0.5),
  }
}))

const EditorDirectoryTree = ({ rootDirectory, onFileSelect }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center" className={classes.titleContainer}>
        <Typography className={classes.title}>
          Files
        </Typography>
        <Tooltip title="Add file">
          <IconButton size="small" className={classes.margin}>
            <NoteAddIcon fontSize="inherit"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Add folder">
          <IconButton size="small">
            <CreateNewFolderIcon fontSize="inherit"/>
          </IconButton>
        </Tooltip>
      </Box>
      <Directory directory={rootDirectory}/>
    </div>
  )
}

export default EditorDirectoryTree
