import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SaveIcon from '@material-ui/icons/Save'

const EditorToolbar = ({
    onClickRun,
    onClickSave,
    onChangeTitle,
    title 
}) => (
  <Toolbar>
    <Box flexGrow="1">
      <TextField
        label="Title"
        placeholder="Untitled"
        onChange={(e) => onChangeTitle(e.target.value)}
        value={title}
      />
    </Box>
    <Tooltip title="Ctrl + Enter">
      <Button
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={onClickRun}
        style={{ marginRight: '10px' }}
        variant="contained"
      >
        Run
      </Button>
    </Tooltip>
    <Tooltip title="Ctrl + S">
      <Button
        color="primary"
        startIcon={<SaveIcon/>}
        onClick={onClickSave}
        variant="outlined"
      >
        Save
      </Button>
    </Tooltip>
  </Toolbar>
)

EditorToolbar.propTypes = {
  onClickRun: PropTypes.func.isRequired,
  onClickSave: PropTypes.func.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default EditorToolbar
