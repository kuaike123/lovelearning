import type {PresenterSpeechWindow} from '../components/PresenterMascot';

const WINDOW_START = 0.1;
const WINDOW_END = 0.9;
const SENTENCE_GAP = 0.06;

const roundWindowPoint = (value: number) => Math.round(value * 100) / 100;

const splitNarrationIntoBeats = (text: string) => {
  const beats = text
    .split(/[。！？!?；;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return beats.length ? beats : [text.trim()].filter(Boolean);
};

export const buildPresenterSpeechWindows = (text: string): PresenterSpeechWindow[] => {
  const beats = splitNarrationIntoBeats(text);

  if (beats.length <= 1) return [{start: WINDOW_START, end: WINDOW_END}];

  const totalGap = SENTENCE_GAP * (beats.length - 1);
  const beatDuration = (WINDOW_END - WINDOW_START - totalGap) / beats.length;

  return beats.map((_, index) => {
    const start = WINDOW_START + index * (beatDuration + SENTENCE_GAP);
    const end = index === beats.length - 1 ? WINDOW_END : start + beatDuration;

    return {
      start: roundWindowPoint(start),
      end: roundWindowPoint(end)
    };
  });
};
