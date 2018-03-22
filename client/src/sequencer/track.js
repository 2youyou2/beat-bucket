// TRACK CLASS

import Tone from 'tone';
import { createPartEvents } from './utils';
import {
  selectTrack,
  selectMuted,
  selectSequence,
  selectBaseNote,
  selectTrackVolume,
  selectEnvelope,
  selectOscillator
} from '../redux/selectors';
import { observeStore } from '../redux/observers';
import { updateCurrentNote } from '../redux/actions/actions-track';

export default class Track {
  constructor(store, id) {
    this.store = store;
    this.id = id;

    const { sequence, baseNote, synth } = selectTrack(id)(store.getState());
    this.sequence = sequence;
    this.baseNote = baseNote;

    this.synth = new Tone.Synth({ 
      envelope: synth.envelope, 
      oscillator: synth.oscillator 
    }).toMaster();

    this.part = this.initPart(sequence, baseNote);

    this.subscriptions = [
      observeStore(store, selectSequence(id), this.onSequenceChange.bind(this)),
      observeStore(store, selectMuted(id), this.onMutedChange.bind(this)),
      observeStore(store, selectBaseNote(id), this.onBaseNoteChange.bind(this)),
      observeStore(store, selectTrackVolume(id), this.onVolumeChange.bind(this)),
      observeStore(store, selectEnvelope(id), this.onEnvelopeChange.bind(this)),
      observeStore(store, selectOscillator(id), this.onOscillatorChange.bind(this))
    ];
  }

  deleteSelf() {
    // unsubscribe from all subscriptions
    this.subscriptions.forEach(unsubscribe => unsubscribe());

    // dispose of the synth
    this.synth.dispose();
    this.synth = null;

    // dispose of the part
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
    part.loopEnd = `${sequence.length}*0:${(baseNote / 4)}`;

    return part;
  }

  partProcessor(time, { value, dur, bucketIndex, noteIndex }) {
    // only trigger a note if it's not a rest, but dispatch currentNote in either case
    value !== 'rest' &&
      this.synth.triggerAttackRelease(value, dur, time);
    this.store.dispatch(
      updateCurrentNote({ bucketId: bucketIndex, noteIndex, trackId: this.id })
    );
  }

  onMutedChange(muted) {
    muted
      ? this.synth.volume.value = -Infinity
      : this.synth.volume.value = selectTrackVolume(this.id)(this.store.getState());
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

  onVolumeChange(volume) {
    this.synth.volume.value = volume;
  }

  onEnvelopeChange(envelope) {
    for (let item in envelope) {
      this.synth.envelope[item] = envelope[item];
    }
  }

  onOscillatorChange(oscillator) {
    const envelope = selectEnvelope(this.id)(this.store.getState());
    this.synth.dispose();
    this.synth = new Tone.Synth({ envelope, oscillator }).toMaster();
  }

}
