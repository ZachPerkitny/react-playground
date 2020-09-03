import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import CodeIcon from '@material-ui/icons/Code'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import Node from './Node'

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
  },
}))

const EditorDirectoryTree = ({
  creatingNodeType,
  rootNode,
  selectedNodeId,
  getName,
  isToggled,
  onClick,
  onDelete,
  onNewNodeStart,
  onNewNodeEnd,
  onRename,
}) => {
  const classes = useStyles()

  const handleClickNewNode = (type) => () => {
    onNewNodeStart(rootNode, [], type)
  }

  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center" className={classes.titleContainer}>
        <Typography className={classes.title}>
          Files
        </Typography>
        <Tooltip title="Add file">
          <IconButton size="small" className={classes.margin} onClick={handleClickNewNode('file')}>
            <NoteAddIcon fontSize="inherit"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Add folder">
          <IconButton size="small" onClick={handleClickNewNode('folder')}>
            <CreateNewFolderIcon fontSize="inherit"/>
          </IconButton>
        </Tooltip>
      </Box>
      <Node
        creatingNodeType={creatingNodeType}
        selectedNodeId={selectedNodeId}
        node={rootNode}
        getName={getName}
        isToggled={isToggled}
        onClick={onClick}
        onDelete={onDelete}
        onNewNodeStart={onNewNodeStart}
        onNewNodeEnd={onNewNodeEnd}
        onRename={onRename}
      />
    </div>
  )
}

EditorDirectoryTree.propTypes = {
  creatingNodeType: PropTypes.string,
  rootNode: PropTypes.object.isRequired,
  selectedNodeId: PropTypes.string,
  getName: PropTypes.func.isRequired,
  isToggled: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNewNodeStart: PropTypes.func.isRequired,
  onNewNodeEnd: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export default EditorDirectoryTree
