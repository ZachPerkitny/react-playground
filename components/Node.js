import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DescriptionIcon from '@material-ui/icons/Description'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FolderIcon from '@material-ui/icons/Folder'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import NodeNameForm from './NodeNameForm'
import CSSIcon from './icons/CSS'
import JSIcon from './icons/JS'
import LessIcon from './icons/Less'
import SassIcon from './icons/Sass'

const useStyles = makeStyles(theme => ({
  header: {
    height: '44px',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingLeft: props => theme.spacing(2) * props.depth,
    paddingRight: theme.spacing(0.5),
    cursor: 'pointer',
    flexGrow: 1,
  },
  headerUnselected: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  headerSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  headerIcon: {
    marginRight: theme.spacing(1),
  },
  deleteText: {
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.error.main,
  },
  nodeCreationContainer: {
    height: '44px',
    paddingBottom: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    paddingLeft: props => theme.spacing(2) * (props.depth + 1),
    paddingRight: theme.spacing(0.5),
    flexGrow: 1,
  },
  nodeCreationIcon: {
    marginRight: theme.spacing(1),
  },
}))

const Node = ({
  creatingNodeType,
  depth,
  node,
  parentPath,
  selectedNodeId,
  getName,
  isToggled,
  onClick,
  onDelete,
  onNewNodeStart,
  onNewNodeEnd,
  onRename
}) => {
  const classes = useStyles({ depth })

  const [anchorEl, setAnchorEl] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const nodeName = getName(node)
  console.log(parentPath, nodeName)
  const nodePath = (parentPath === null) ? [] : [...parentPath, nodeName]
  const isNodeSelected = (selectedNodeId === node.id)
  const isNodeToggled = isToggled(node)
  const isFolder = Boolean(node.childNodes)

  const handleClickContainer = () => {
    if (onClick) onClick(node, nodePath)
  }

  const handleRenameFormCancel = () => {
    setIsEditing(false)
  }

  const handleRenameFormSubmit = (text) => {
    setIsEditing(false)
    onRename(node, nodePath, text)
  }

  const handleOpenMenu = (e) => {
    e.stopPropagation()
    setAnchorEl(e.target)
  }

  const handleCloseMenu = (e) => {
    e.stopPropagation()
    setAnchorEl(null)
  }

  const handleSelectRename = (e) => {
    e.stopPropagation()
    setAnchorEl(null)
    setIsEditing(true)
  }

  const handleSelectDelete = (e) => {
    e.stopPropagation()
    setAnchorEl(null)
    onDelete(node, nodePath)
  }

  const handleNewNodeStart = (type) => (e) => {
    e.stopPropagation()
    setAnchorEl(null)
    onNewNodeStart(node, [], type)
  }

  const handleNewNodeSubmit = (text) => {
    onNewNodeEnd(node, nodePath, creatingNodeType, text)
  }

  const handleNewNodeCancel = () => {
    onNewNodeEnd(node, nodePath, creatingNodeType, '')
  }

  const getIcon = () => {
    const props = {
      className: classes.headerIcon,
      fontSize: 'small',
    }
    let Icon
    if (!node.childNodes) {
      const ext = nodeName.split('.')[1]
      switch (ext) {
      case 'css':
        Icon = CSSIcon
        break
      case 'js':
      case 'jsx':
        Icon = JSIcon
        break
      case 'less':
        Icon = LessIcon
        break
      case 'sass':
      case 'scss':
        Icon = SassIcon
        break
      default:
        Icon = DescriptionIcon
        break
      }
    } else {
      Icon = (isNodeToggled) ? (
        KeyboardArrowDownIcon
      ) : (
        ChevronRightIcon
      )
    }

    return <Icon {...props}/>
  }

  const getHeader = () => {
    if (depth === 0) return null
    const rootClass =  (isNodeSelected) ?
      `${classes.header} ${classes.headerSelected}` :
      `${classes.header} ${classes.headerUnselected}`
    return (
      <Box
        className={rootClass}
        display="flex"
        justifyContent="space-between"
        onClick={handleClickContainer}
      >
        <Box display="flex" alignItems="center">
          {getIcon()}
          {(isEditing) ? (
          <NodeNameForm
            initialText={nodeName}
            onCancel={handleRenameFormCancel}
            onSubmit={handleRenameFormSubmit}/>
          ) : (
          <Typography className={classes.text}>
            {nodeName}
          </Typography>
          )}
        </Box>
        {!isEditing && (
        <div>
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon fontSize="small"/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleSelectRename}>
              Rename
            </MenuItem>
            {isFolder && 
            <Fragment>
              <MenuItem onClick={handleNewNodeStart('file')}>
                Add file
              </MenuItem>
              <MenuItem onClick={handleNewNodeStart('folder')}>
                Add folder
              </MenuItem>
            </Fragment>
            }
            <MenuItem className={classes.deleteText} onClick={handleSelectDelete}>
              Delete
            </MenuItem>
          </Menu>
        </div>)}
      </Box>
    )
  }

  console.log(isNodeSelected, creatingNodeType, isNodeSelected)
  return (
    <div>
      {getHeader()}
      <Collapse in={isNodeToggled}>
      {node.childNodes && node.childNodes.map(childNode => (
        <Node
          creatingNodeType={creatingNodeType}
          depth={depth + 1}
          node={childNode}
          key={childNode.id}
          parentPath={nodePath}
          selectedNodeId={selectedNodeId}
          getName={getName}
          isToggled={isToggled}
          onClick={onClick}
          onDelete={onDelete}
          onNewNodeStart={onNewNodeStart}
          onNewNodeEnd={onNewNodeEnd}
          onRename={onRename}
        />
      ))}
      {isFolder && creatingNodeType && isNodeSelected &&
      <Box
        className={classes.nodeCreationContainer}
        alignItems="center"
        display="flex"
      >
        {(creatingNodeType === 'file') ? (
          <DescriptionIcon className={classes.nodeCreationIcon} fontSize="small"/>
        ) : (
          <FolderIcon className={classes.nodeCreationIcon} fontSize="small"/>
        )}
        <NodeNameForm
          onCancel={handleNewNodeCancel}
          onSubmit={handleNewNodeSubmit}
        />
      </Box>
      }
      </Collapse>
    </div>
  )
}

Node.defaultProps = {
  creatingNodeType: null,
  depth: 0,
  parentPath: null,
}

Node.propTypes = {
  creatingNodeType: PropTypes.oneOf([null, 'file', 'folder']),
  depth: PropTypes.number.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    childNodes: PropTypes.array,
    toggled: PropTypes.bool,
  }).isRequired,
  parentPath: PropTypes.array.isRequired,
  selectedNodeId: PropTypes.string,
  getName: PropTypes.func.isRequired,
  isToggled: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onNewNodeStart: PropTypes.func.isRequired,
  onNewNodeEnd: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export default Node
