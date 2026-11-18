'use client';
import { useEffect, useRef, useState } from 'react';

/** Original, synthesized 48-second score. Integer cycle counts make the loop seamless. */
function score(context: AudioContext) {
  const seconds = 48,
    rate = 22050,
    buffer = context.createBuffer(2, seconds * rate, rate);
  const chords = [
    [130.81, 196, 261.63],
    [174.61, 220, 261.63],
    [146.83, 220, 293.66],
    [196, 246.94, 293.66],
  ];
  for (let channel = 0; channel < 2; channel++) {
    const output = buffer.getChannelData(channel);
    for (let i = 0; i < output.length; i++) {
      const time = i / rate,
        bar = Math.floor(time / 12),
        t = time % 12;
      const envelope = Math.sin((Math.PI * t) / 12) ** 2;
      let sample = 0;
      for (let n = 0; n < 3; n++) {
        const frequency = Math.round(chords[bar][n] * seconds) / seconds;
        sample += Math.sin(time * Math.PI * 2 * frequency + channel * 0.13 * n) * 0.045 * envelope;
        sample += Math.sin(time * Math.PI * 2 * frequency * 2 + channel * 0.2) * 0.008 * envelope;
      }
      const chimeEnvelope = Math.exp(-(t % 3) * 2.4) * Math.sin((Math.PI * (t % 3)) / 3);
      const chime = Math.round(chords[bar][Math.floor(t / 3) % 3] * 4 * seconds) / seconds;
      output[i] = sample + Math.sin(time * Math.PI * 2 * chime) * chimeEnvelope * 0.025;
    }
  }
  return buffer;
}
export default function Ambience({ revealing, page }: { revealing: boolean; page: number | null }) {
  const engine = useRef<{
    context: AudioContext;
    gain: GainNode;
    source: AudioBufferSourceNode;
  } | null>(null);
  const [playing, setPlaying] = useState(false),
    [volume, setVolume] = useState(0.35);
  const previous = useRef({ revealing, page });
  useEffect(() => {
    const prior = previous.current;
    previous.current = { revealing, page };
    if (!engine.current || !playing) return;
    const opening = revealing && !prior.revealing;
    const turning = page !== null && prior.page !== null && page !== prior.page;
    if (!opening && !turning) return;
    const { context, gain } = engine.current;
    const notes = opening ? [523.25, 659.25, 783.99, 1046.5] : [392, 587.33];
    notes.forEach((pitch, index) => {
      const tone = context.createOscillator();
      const envelope = context.createGain();
      const start = context.currentTime + (opening ? 0.7 + index * 0.28 : index * 0.08);
      const duration = opening ? 0.8 : 0.24;
      tone.type = 'sine';
      tone.frequency.value = pitch;
      envelope.gain.setValueAtTime(0.001, start);
      envelope.gain.exponentialRampToValueAtTime(opening ? 0.038 : 0.012, start + 0.04);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
      tone.connect(envelope).connect(gain);
      tone.start(start);
      tone.stop(start + duration);
      tone.onended = () => {
        tone.disconnect();
        envelope.disconnect();
      };
    });
  }, [page, playing, revealing]);
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
