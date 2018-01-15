// ACTION CREATORS

export const PLAY = 'play';
export const STOP = 'stop';
export const UPDATE_CURRENT_NOTE = 'update_current_note';
export const UPDATE_CURRENT_TRACK = 'update_current_track';
export const MUTE = 'mute';
export const SOLO = 'solo';
export const UNMUTE = 'unmute';
export const UNSOLO = 'unsolo';
export const ADD_NOTE = 'add_note';
export const DELETE_NOTE = 'delete_note';
export const MOVE_NOTE = 'move_note';
export const ADD_BUCKET = 'add_bucket';
export const DELETE_BUCKET = 'delete_bucket';
export const ADD_TRACK = 'add_track';
export const DELETE_TRACK = 'delete_track';
export const CHANGE_BASE_NOTE = 'change_base_note';
export const INCREMENT_OCTAVE = 'increment_octave';
export const DECREMENT_OCTAVE = 'decrement_octave';

export function play() {
  return {
    type: PLAY
  };
}

export function stop() {
  return {
    type: STOP
  };
}

export function updateCurrentNote({ bucketIndex, noteIndex, trackId }) {
  return {
    type: UPDATE_CURRENT_NOTE,
    payload: { bucketIndex, noteIndex, trackId }
  };
}

export function updateCurrentTrack(trackId) {
  return {
    type: UPDATE_CURRENT_TRACK,
    payload: trackId
  };
}

export function mute(trackId) {
  return {
    type: MUTE,
    payload: trackId
  };
}

export function unmute(trackId) {
  return {
    type: UNMUTE,
    payload: trackId
  };
}

export function solo(trackId) {
  return {
    type: SOLO,
    payload: trackId
  };
}

export function unsolo(trackId) {
  return {
    type: UNSOLO,
    payload: trackId
  };
}

export function addNote({ note, id=null, index, bucketId, trackId }) {
  return {
    type: ADD_NOTE,
    payload: { note, id, index, bucketId, trackId }
  };
}

export function deleteNote({ noteIndex, bucketId, trackId }) {
  return {
    type: DELETE_NOTE,
    payload: { noteIndex, bucketId, trackId }
  };
}

export function moveNote(payload) {
  return {
    type: MOVE_NOTE,
    payload
  };
}

export function addBucket({ trackId }) {
  return {
    type: ADD_BUCKET,
    payload: { trackId }
  };
}

export function deleteBucket({ trackId, bucketId }) {
  return {
    type: DELETE_BUCKET,
    payload: { trackId, bucketId }
  };
}

export function addTrack() {
  return {
    type: ADD_TRACK
  };
}

export function deleteTrack({ trackId }) {
  return {
    type: DELETE_TRACK,
    payload: { trackId }
  };
}

export function changeBaseNote({ baseNote, trackId }) {
  return {
    type: CHANGE_BASE_NOTE,
    payload: { baseNote, trackId }
  };
}

export function incrementOctave() {
  return {
    type: INCREMENT_OCTAVE
  };
}

export function decrementOctave() {
  return {
    type: DECREMENT_OCTAVE
  };
}
