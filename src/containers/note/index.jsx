// NOTE

import React from 'react';
import { connect } from 'react-redux';                        
import { bindActionCreators } from 'redux';
import { DragSource } from 'react-dnd';
import { dropNote } from '../../actions';
import './note.css';

const Note = ({ name, styleName, connectDragSource }) => {                    

  return connectDragSource(
    <div className={`note ${styleName}`}>
      {name}
    </div>
  );                    
};

const noteSource = {
  beginDrag({ name }) {
    return { name };
  },

  isDragging(props, monitor) {
    return monitor.getItem().name === props.name;
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { name, currentTrack, dropNote } = props;
      const { target } = monitor.getDropResult();
      dropNote(name, target, currentTrack);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function mapStateToProps({ globals: { currentTrack } }) {                            
  return { currentTrack };
}                             

function mapDispatchToProps(dispatch) {                            
  return bindActionCreators({ dropNote }, dispatch);                            
}

const ds_Note = DragSource('note', noteSource, collect)(Note);

export default connect(mapStateToProps, mapDispatchToProps)(ds_Note);
