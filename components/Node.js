import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import DescriptionIcon from '@material-ui/icons/Description'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FolderIcon from '@material-ui/icons/Folder'
import NodeHeader from './NodeHeader'
import CSSIcon from './icons/CSS'
import JSIcon from './icons/JS'
import LessIcon from './icons/Less'
import SassIcon from './icons/Sass'

const useStyles = makeStyles(theme => ({
  margin: {
    marginRight: theme.spacing(1),
  },
  filesEnter: {
    opacity: 0,
  },
  filesEnterActive: {
    opacity: 1,
    transition: 'opacity 500ms ease-in',
  },
  filesLeave: {
    opacity: 1,
  },
  filesLeaveActive: {
    opacity: 0,
    transition: 'opacity 300ms ease-in',
  },
}))

const Node = ({ depth, node, path, onDelete, onRename }) => {
  const classes = useStyles()
  const [isExpanded, setExpanded] = useState(depth === 0)

  const onClickHeader = () => {
    setExpanded((prev) => !prev)
  }

  const getIcon = () => {
    if (!node.childNodes) {
      const ext = node.name.split('.')[1]
      switch (ext) {
      case 'css':
        return <CSSIcon fontSize="small"/>
      case 'js':
      case 'jsx':
        return <JSIcon fontSize="small"/>
      case 'less':
        return <LessIcon fontSize="small"/>
      case 'sass':
      case 'scss':
        return <SassIcon fontSize="small"/>
      default:
        return <DescriptionIcon fontSize="small"/>
      }
    }

    return (isExpanded) ? (
      <KeyboardArrowDownIcon fontSize="small"/>
    ) : (
      <ChevronRightIcon fontSize="small"/>
    )
  }

  return (
    <div>
      {depth > 0 &&
      <NodeHeader
        depth={depth}
        icon={getIcon()}
        text={node.name}
        onClick={onClickHeader}
        onDelete={() => onDelete(node, path)}
        onRename={(newName) => onRename(node, path, newName)}
      />
      }
      <Collapse in={isExpanded}>
      {node.childNodes && node.childNodes.map(childNode => (
        <Node
          depth={depth + 1}
          node={childNode}
          key={childNode.id}
          path={[...path, childNode.name]}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
      </Collapse>
    </div>
  )
}

Node.defaultProps = {
  depth: 0,
  path: [],
}

Node.propTypes = {
  depth: PropTypes.number.isRequired,
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    content: PropTypes.string,
    childNodes: PropTypes.array,
  }).isRequired,
  path: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
}

export default Node
