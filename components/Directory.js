import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FolderIcon from '@material-ui/icons/Folder'
import File from './File'
import FileHeader from './FileHeader'

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

const Directory = ({ depth, directory }) => {
  const classes = useStyles()
  const [isExpanded, setExpanded] = useState(depth === 0)

  const onClickHeader = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <div>
      {depth > 0 &&
      <FileHeader
        depth={depth}
        icon={
          isExpanded ? (
            <KeyboardArrowDownIcon fontSize="small"/>
          ) : (
            <ChevronRightIcon fontSize="small"/>
          )
        }
        text={directory.name}
        onClick={onClickHeader}
      />
      }
      {(directory.directories || []).map(directory => (
        <Directory
          depth={depth + 1}
          directory={directory}
        />
      ))}
      <Collapse in={isExpanded}>
      {(directory.files || []).map((file, i) => (
        <File
          depth={depth + 1}
          file={file}
          key={file.name}
        />
      ))}
      </Collapse>
    </div>
  )
}

Directory.defaultProps = {
  depth: 0,
}

Directory.propTypes = {
  depth: PropTypes.number.isRequired,
  directory: PropTypes.object.isRequired,
}

export default Directory
