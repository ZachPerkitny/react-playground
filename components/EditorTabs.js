import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close';

import 'ace-builds/src-noconflict/mode-css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-less'
import 'ace-builds/src-noconflict/mode-sass'

const useStyles = makeStyles(theme => ({
  tab: {
    cursor: 'pointer',
    padding: theme.spacing(1),
  },
  tabUnselected: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  tabSelected: {
    backgroundColor: theme.palette.action.selected,
  },
  closeIcon: {
    marginLeft: theme.spacing(1),
  },
}))

const EditorTabs = ({
  code,
  tabs,
  selectedTab,
  getName,
  onCodeChange,
  onCloseTab,
  onSelectTab,
}) => {
  const classes = useStyles()

  const handleEditorChange = (value) => {
    onCodeChange(value)
  }

  const handleEditorLoad = (editor) => {
    editor.renderer.setPadding(5)
  }

  const handleCloseTab = (nodeId) => (e) => {
    e.stopPropagation()
    onCloseTab(nodeId)
  }

  const handleSelectTab = (nodeId) => () => {
    onSelectTab(nodeId)
  }

  const getMode = () => {
    const ext = getName(selectedTab).split('.')[1]
    switch (ext) {
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'less':
      return 'less'
    case 'sass':
    case 'scss':
      return 'sass'
    default:
      return null
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
    >
      <Box display="flex">
        {tabs.map(nodeId => {
          const className = (selectedTab === nodeId) ?
            `${classes.tab} ${classes.tabSelected}` :
            `${classes.tab} ${classes.tabUnselected}`
          return (
            <Box
              className={className}
              display="flex"
              key={nodeId}
              onClick={handleSelectTab(nodeId)}
            >
              <Typography>
                {getName(nodeId)}
              </Typography>
              {tabs.length > 1 && (
              <IconButton
                className={classes.closeIcon}
                edge="end"
                onClick={handleCloseTab(nodeId)}
                size="small"
              >
                <CloseIcon fontSize="inherit"/>
              </IconButton>
              )}
            </Box>
          )
        })}
      </Box>
      <AceEditor
        onChange={handleEditorChange}
        onLoad={handleEditorLoad}
        mode={getMode()}
        value={code}
        width="100%"
        height="auto"
        style={{ flexGrow: 1 }}
      />
    </Box>
  )
}

EditorTabs.propTypes = {
  code: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  getName: PropTypes.func.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onSelectTab: PropTypes.func.isRequired,
}

export default EditorTabs
