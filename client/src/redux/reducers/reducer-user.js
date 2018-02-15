// USER REDUCER
import { SET_USER, SAVE, LOAD_PROJECTS } from '../actions/actions-user.js';
import {
  CHANGE_PROJECT_NAME,
  LOAD_PROJECT,
  DELETE_PROJECT,
  CHANGE_BPM,
  CREATE_NEW_PROJECT } from '../actions/actions-project.js';
import { ADD_TRACK, DELETE_TRACK } from '../actions/actions-tracks.js';
import {
  MUTE,
  SOLO,
  UNMUTE,
  UNSOLO,
  CHANGE_BASE_NOTE,
  CHANGE_TRACK_NAME,
  UPDATE_TRACK_VOLUME } from '../actions/actions-track.js';
import {
  ADD_NOTE,
  DELETE_NOTE,
  MOVE_NOTE,
  ADD_BUCKET,
  DELETE_BUCKET } from '../actions/actions-sequence.js';

const starter = {
  email: null,
  id: null,
  canSave: true,
  projects: {}
};

export default function(state = starter, action) {
  let newState;

  switch (action.type) {
  case SET_USER:
    newState = { ...state };
    newState.email = action.payload.email;
    newState.id = action.payload.id;
    newState.canSave = true;
    return newState;

  case LOAD_PROJECT:
    // if there's no id (e.g. loading a shared project), no change
    if (!action.payload.id)
      return state;
    newState = { ...state };
    newState.canSave = false;
    return newState;

  case SAVE:
    return save(state, action.payload);

  case LOAD_PROJECTS:
    newState = { ...state };
    // newState.projects = action.payload;
    newState.projects = {};
    action.payload.forEach(([id, name]) => { newState.projects[id] = name; });
    return newState;

  case DELETE_PROJECT:
    newState = { ...state };
    newState.projects = { ...newState.projects };
    delete newState.projects[action.payload];
    newState.canSave = true;
    return newState;

  case CHANGE_BPM:
  case CREATE_NEW_PROJECT:
  case CHANGE_PROJECT_NAME:
  case ADD_TRACK:
  case DELETE_TRACK:
  case MUTE:
  case SOLO:
  case UNMUTE:
  case UNSOLO:
  case CHANGE_BASE_NOTE:
  case CHANGE_TRACK_NAME:
  case UPDATE_TRACK_VOLUME:
  case ADD_NOTE:
  case DELETE_NOTE:
  case MOVE_NOTE:
  case ADD_BUCKET:
  case DELETE_BUCKET:
    if (state.canSave)
      return state;
    newState = { ...state };
    newState.canSave = true;
    return newState;

  default:
    return state;
  }
}

function save(state, { id, name }) {
  const newState = { ...state };
  newState.canSave = false;
  if (newState.projects.hasOwnProperty(id) && name !== newState.projects[id]) {
    newState.projects = { ...newState.projects };
    newState.projects[id] = name;
  }
  else if (!newState.projects.hasOwnProperty(id))
    newState.projects = { ...newState.projects, [id]: name };

  return newState;
}
