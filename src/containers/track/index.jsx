// TRACK

import React from 'react';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../../item-types';
import './track.css';

import BucketRow from '../bucket-row';
import Notebar from '../notebar';

const Track = ({ connectDropTarget, isOver, dragItem, name, sequence, currentNote }) => {
  const styleName = (isOver && !dragItem.name)
    ? 'track hover'
    : 'track';

  return connectDropTarget(
    <div className={styleName}>
      <div>{name}</div>
      <Notebar />
      <BucketRow sequence={sequence} currentNote={currentNote} />
    </div>
  );
};

const trackTarget = {
  drop(props, monitor) {
    // if the item has been dropped on a child target, then we don't want to do anything
    if (monitor.didDrop())
      return;
    return { target: 'delete' };
  },

  hover(props, monitor) {
    const item = monitor.getItem();

  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
    dragItem: monitor.getItem()
  };
}

function mapStateToProps({ tracks, globals: { currentTrack } }) {
  return tracks[currentTrack];
}

const Track_DT = DropTarget(ItemTypes.KEYBOARD_NOTE, trackTarget, collect)(Track);

export default connect(mapStateToProps)(Track_DT);
