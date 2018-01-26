// TRACK CLASS

import Tone from 'tone';
import { createPartEvents } from './utils';
import {
  selectTrack,
  selectMuted,
  selectSequence,
  selectTrackExists,
  selectBaseNote
} from '../redux/selectors';
import { observeStore } from '../redux/observers';
import { updateCurrentNote } from '../redux/actions/actions-track';

export default class Track {
  constructor(store, id) {
    this.store = store;
    this.id = id;
    this.muted = false;
    this.synth = new Tone.Synth().toMaster();

    // get sequence and baseNote of track from the store
    const { sequence, baseNote } = selectTrack(id)(store.getState());
    this.sequence = sequence;
    this.baseNote = baseNote;

    this.part = this.initPart(sequence, baseNote);

    this.unsubscribeDeleted = observeStore(
      store,
      selectTrackExists(id),
      this.onDelete.bind(this)
    );

    this.unsubscribeSequenceChange = observeStore(
      store,
      selectSequence(id),
      this.onSequenceChange.bind(this)
    );

    this.unsubscribeMuted = observeStore(
      store,
      selectMuted(id),
      this.onMutedChange.bind(this)
    );

    this.unsubscribeBaseNote = observeStore(
      store,
      selectBaseNote(id),
      this.onBaseNoteChange.bind(this)
    );
  }

  onDelete(exists) {
    if (!exists) {
      this.deleteSelf();
    }
  }

  deleteSelf() {
    this.unsubscribeMuted();
    this.unsubscribeSequenceChange();
    this.synth.dispose();
    this.synth = null;
    this.part.dispose();
    this.part = null;
  }

  initPart(sequence, baseNote) {
    const part = new Tone.Part(
      this.partProcessor.bind(this),
      createPartEvents(sequence, baseNote)
    );

    part.start(0);
    part.loop = true;
    part.loopEnd = `${sequence.length}*0:${baseNote}`;

    return part;
  }

  partProcessor(time, { note, dur, bucketIndex, noteIndex }) {
    this.synth.triggerAttackRelease(note, dur, time);
    this.dispatchCurrentNote(bucketIndex, noteIndex);
  }

  dispatchCurrentNote(bucketIndex, noteIndex) {
    this.store.dispatch(
      updateCurrentNote({ bucketId: bucketIndex, noteIndex, trackId: this.id })
    );
  }

  onMutedChange(muted) {
    muted
      ? this.synth.volume.value = -Infinity
      : this.synth.volume.value = 0;
  }

  onSequenceChange(sequence) {
    this.part.removeAll();
    this.part = this.initPart(sequence, this.baseNote);
    this.sequence = sequence;
  }

  onBaseNoteChange(baseNote) {
    this.part.removeAll();
    this.part = this.initPart(this.sequence, baseNote);
    this.baseNote = baseNote;
  }
}
