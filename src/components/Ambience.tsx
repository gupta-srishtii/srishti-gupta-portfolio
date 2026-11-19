'use client';
import { useEffect, useRef, useState } from 'react';

/** Original 48-second cue. Delays and tails wrap into the head of the loop. */
function score(context: AudioContext) {
  const seconds = 48,
    rate = 22050,
    buffer = context.createBuffer(2, seconds * rate, rate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
  const chords = [
    [45, 52, 55, 60],
    [41, 53, 57, 64],
    [48, 55, 59, 62],
    [43, 50, 58, 62],
  ];
  const melody = [
    [76, 72, 79],
    [77, 81, 76],
    [74, 79, 71],
    [70, 74, 67],
  ];
  function note(
    midi: number,
    when: number,
    length: number,
    gain: number,
    pan: number,
    voice: 'bow' | 'celesta' | 'piano' | 'air',
  ) {
    const offset = Math.round(when * rate);
    const period = 2 * Math.PI * hz(midi);
    const toLeft = Math.sqrt((1 - pan) / 2);
    const toRight = Math.sqrt((1 + pan) / 2);
    for (let i = 0; i < Math.round(length * rate); i++) {
      const t = i / rate;
      const p = t * period;
      const gate = Math.min(1, t / 0.035, (length - t) / 0.35);
      const swell = Math.sin((Math.PI * t) / length) ** 1.6;
      let wave: number;
      if (voice === 'bow') {
        const wobble = 0.24 * Math.sin(t * 28);
        wave =
          (Math.sin(p + wobble) + 0.26 * Math.sin(p * 2.003 + wobble) + 0.12 * Math.sin(p * 3)) *
          swell;
      } else if (voice === 'air') {
        wave = (Math.sin(p + Math.sin(t * 1.6) * 0.9) + Math.sin(p * 1.006) * 0.4) * swell;
      } else if (voice === 'celesta') {
        wave = Math.sin(p) * Math.exp(-t * 1.6) + Math.sin(p * 2.76) * 0.37 * Math.exp(-t * 5.4);
      } else {
        wave =
          (Math.sin(p) + 0.42 * Math.sin(p * 2.003) + 0.15 * Math.sin(p * 3.018)) *
          Math.exp(-t * 1.75);
      }
      const sample = wave * gate * gain;
      const index = (((offset + i) % left.length) + left.length) % left.length;
      left[index] += sample * toLeft;
      right[index] += sample * toRight;
    }
  }
  chords.forEach((chord, bar) => {
    const start = bar * 12;
    chord.forEach((pitch, n) =>
      note(pitch, start - 2 + n * 0.1, 16, n === 0 ? 0.025 : 0.019, (n - 1.5) * 0.42, 'bow'),
    );
    note(chord[0] + 24, start - 1, 15, 0.009, -0.37, 'air');
    [0.2, 4.2, 7.4].forEach((beat, n) =>
      note(chord[n], start + beat, 3.1, 0.036, -0.25 + n * 0.17, 'piano'),
    );
    melody[bar].forEach((pitch, n) => {
      const cue = start + [2.35, 6.05, 9.35][n];
      note(pitch, cue, 3.2, 0.025, n % 2 ? -0.35 : 0.35, 'celesta');
      note(pitch, cue + 0.34, 2.5, 0.005, n % 2 ? 0.48 : -0.48, 'celesta');
    });
  });
  return buffer;
}
export default function Ambience({
  revealing,
  page,
  casting,
  castPan,
}: {
  revealing: boolean;
  page: number | null;
  casting: boolean;
  castPan: number;
}) {
  const engine = useRef<{
    context: AudioContext;
    gain: GainNode;
    source: AudioBufferSourceNode;
  } | null>(null);
  const [playing, setPlaying] = useState(false),
    [volume, setVolume] = useState(0.35);
  const previous = useRef({ revealing, page, casting });
  useEffect(() => {
    const prior = previous.current;
    previous.current = { revealing, page, casting };
    if (!engine.current || !playing) return;
    const opening = revealing && !prior.revealing;
    const turning = page !== null && prior.page !== null && page !== prior.page;
    const cast = casting && !prior.casting;
    if (!opening && !turning && !cast) return;
    const { context, gain } = engine.current;
    const notes = opening
      ? [523.25, 659.25, 783.99, 1046.5]
      : cast
        ? [659.25, 880, 1174.66]
        : [392, 587.33];
    notes.forEach((pitch, index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const start =
        context.currentTime + (opening ? 0.7 + index * 0.28 : index * (cast ? 0.055 : 0.08));
      const duration = opening ? 0.8 : 0.24;
      tone.type = 'sine';
      tone.frequency.value = pitch;
      envelope.gain.setValueAtTime(0.001, start);
      envelope.gain.exponentialRampToValueAtTime(opening ? 0.038 : 0.012, start + 0.04);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
      tone.connect(envelope);
      const pan = cast ? context.createStereoPanner() : null;
      if (pan) {
        pan.pan.setValueAtTime(0.28, start);
        pan.pan.linearRampToValueAtTime(castPan, start + duration * 0.65);
        envelope.connect(pan).connect(gain);
      } else envelope.connect(gain);
      tone.start(start);
      tone.stop(start + duration);
      tone.onended = () => {
        tone.disconnect();
        envelope.disconnect();
        pan?.disconnect();
      };
    });
  }, [page, playing, revealing, casting, castPan]);
  useEffect(
    () => () => {
      if (engine.current) {
        engine.current.source.stop();
        void engine.current.context.close();
      }
    },
    [],
  );
  async function toggle() {
    if (!engine.current) {
      const context = new AudioContext(),
        gain = context.createGain(),
        source = context.createBufferSource();
      source.buffer = score(context);
      source.loop = true;
      gain.gain.value = volume;
      source.connect(gain).connect(context.destination);
      source.start();
      engine.current = { context, gain, source };
    }
    if (playing) {
      await engine.current.context.suspend();
      setPlaying(false);
    } else {
      await engine.current.context.resume();
      setPlaying(true);
    }
  }
  return (
    <div className="ambience">
      <button
        onClick={() => void toggle()}
        aria-pressed={playing}
        aria-label={playing ? 'Mute ambient music' : 'Play ambient music'}
      >
        {playing ? 'Sound on' : 'Sound off'}
      </button>
      <label>
        <span className="sr-only">Ambient volume</span>
        <input
          aria-label="Ambient volume"
          type="range"
          min="0"
          max="1"
          step=".05"
          value={volume}
          onChange={(e) => {
            const next = Number(e.target.value);
            setVolume(next);
            if (engine.current)
              engine.current.gain.gain.setTargetAtTime(
                next,
                engine.current.context.currentTime,
                0.15,
              );
          }}
        />
      </label>
    </div>
  );
}
