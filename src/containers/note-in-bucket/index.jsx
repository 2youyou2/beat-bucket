// NOTE-IN-BUCKET

import React from 'react';
import { connect } from 'react-redux';                        
import { bindActionCreators } from 'redux';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import flow from 'lodash/flow';
import { deleteNote, addNote, moveNote } from '../../actions';
import ItemTypes from '../../item-types';

import Note from '../note';

const NoteInBucket = ({ name, styleName, connectDragSource, connectDropTarget, isDragging }) => {                    

  const opacity = isDragging ? 0 : 1;

  return connectDragSource(
    connectDropTarget(
      <div style={{ opacity }}>
        <Note name={name} styleName={styleName} />
      </div>
    ));
};

const noteInBucketSource = {
  beginDrag(props) {
    return {
      id: props.id,
      noteIndex: props.index,
      bucketId: props.bucketId,
      note: props.name
    };
  },

  isDragging(props, monitor) {
    const { id } = monitor.getItem();
    return props.id === id;
  },

  endDrag(props, monitor) {
    if (monitor.didDrop()) {
      const { name, index, bucketId, currentTrack, deleteNote, moveNote, id } = props;
      const { target } = monitor.getDropResult();

      if (target === 'delete')
        deleteNote({ noteIndex: index, bucketId: bucketId, trackId: currentTrack });

      if (target === 'bucket') {
        const payload = {
          source: {
            index,
            id,
            bucket: bucketId,
            note: name
          },
          target: {
            index: monitor.getDropResult().length,
            bucket: monitor.getDropResult().bucketId
          },
          track: currentTrack
        };
        moveNote(payload);
      }
        
    }
  }
};

const noteInBucketTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().noteIndex;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex)
      return;

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
      return;

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      return;

    const item = monitor.getItem();

    if (item.name) {
      props.addNote({
        note: item.name,
        id: item.id,
        index: hoverIndex,
        bucketId: props.bucketId,
        trackId: props.currentTrack
      });
      monitor.getItem().note = item.name;
      monitor.getItem().name = null;
      monitor.getItem().noteIndex = props.index;
      monitor.getItem().bucketId = props.bucketId;
      return;
    }

    const payload = {
      source: {
        index: dragIndex,
        id: item.id,
        bucket: item.bucketId,
        note: item.note
      },
      target: {
        index: hoverIndex,
        bucket: props.bucketId
      },
      track: props.currentTrack
    };

    props.moveNote(payload);

    monitor.getItem().noteIndex = hoverIndex;
    monitor.getItem().bucketId = props.bucketId;

  }
};

function sourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function targetCollect(connect) {
  return { 
    connectDropTarget: connect.dropTarget()
  };
}

function mapStateToProps({ globals: { currentTrack }}) {                            
  return { currentTrack };
}                             

function mapDispatchToProps(dispatch) {                            
  return bindActionCreators({ deleteNote, addNote, moveNote }, dispatch);
}

const NoteInBucket_DTDS =  flow([
  DragSource(ItemTypes.NOTE, noteInBucketSource, sourceCollect),
  DropTarget(ItemTypes.NOTE, noteInBucketTarget, targetCollect)
])(NoteInBucket);

export default connect(mapStateToProps, mapDispatchToProps)(NoteInBucket_DTDS);
