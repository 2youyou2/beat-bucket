// PROJECT

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropTarget } from 'react-dnd';
import {
  play,
  stop,
  changeProjectName,
  setProjectId,
  deleteProject } from '../../redux/actions/actions-project';
import { save } from '../../redux/actions/actions-user';
import { selectProject } from '../../redux/selectors';
import ItemTypes from '../../dnd/item-types';

import './project.css';

import Tracks from '../tracks';
import EditableText from '../../components/editable-text';
import ProjectButtons from '../project-buttons';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = { editingName: false, saving: false };

    this.handlePlayStopClick = this.handlePlayStopClick.bind(this);
    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleNameBlur = this.handleNameBlur.bind(this);
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
  }

  handlePlayStopClick() {
    const { playing, stop, play } = this.props;
    playing
      ? stop()
      : play();
  }

  handleNameClick() {
    this.setState({ editingName: true });
  }

  handleNameBlur() {
    this.setState({ editingName: false });
  }

  handleProjectNameChange(newName) {
    this.props.changeProjectName({ name: newName });
  }

  renderPlayStop() {
    const className = this.props.playing ? 'stop' : 'play';
    return (
      <button onClick={this.handlePlayStopClick} className="playstop-button button-dark">
        <div className={className} />
      </button>
    );
  }

  render() {
    const { name } = this.props;
    return this.props.connectDropTarget(
      <div className="project">
        <div className="project-header">
          <div className="project-title">
            <EditableText
              value={name}
              onInputChange={this.handleProjectNameChange}
            />
          </div>
          {this.renderPlayStop()}
          <ProjectButtons {...this.props} />
        </div>
        <Tracks />
      </div>
    );
  }
}

const projectTarget = {
  drop(_, monitor) {
    // if it's been dropped on a child target, don't do anything
    if (monitor.didDrop())
      return;
    return { target: 'delete' };
  }
};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

function mapStateToProps(state) {
  return { ...selectProject(state) };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    play,
    stop,
    changeProjectName,
    setProjectId,
    save,
    deleteProject
  };
  return bindActionCreators(actions, dispatch);
}

const dt_Project = DropTarget(ItemTypes.NOTE, projectTarget, collect)(Project);

export default connect(mapStateToProps, mapDispatchToProps)(dt_Project);


/*
<div>
            <div>
              {/*<button className="project-button button-dark">Share</button>}
              <button
                className="project-button button-dark"
                onClick={this.handleDeleteClick}
              >
                Delete
              </button>
              <button
                className="project-button button-dark"
                onClick={this.handleSaveClick}
                disabled={!canSave}
              >
                {this.state.saving
                  ? 'Saving'
                  : canSave
                    ? 'Save'
                    : 'Saved'}
              </button>
            </div>
          </div>

*/
