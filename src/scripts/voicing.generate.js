const {
  getVoicingsFromChord,
  translate,
} = require('@martijnmichel/chordshape');
const { Chord, Interval, Note } = require('@tonaljs/tonal');
const { orderBy, find } = require('lodash');

import useJSDom from '../composables/jsdom';

const options = {
  variant: 0,
  harmFunc: false,
};

function generateVoicing(c, opts) {
  Object.assign(options, opts);

  const { getStrings, newDom } = useJSDom();
  const strings = getStrings();

  const chord = Chord.get(c.aliases[0]);
  let name = chord.name;
  if (name === '') name = chord.aliases[0];

  const voicings = getVoicingsFromChord(chord.aliases[0]);

  const translated = translate(voicings[options.variant], c.tonic);

  const voicing = translated.shape
    .slice()
    .reverse()
    .map((n, i) => [i + 1, n]);

  const dom = newDom();

  const { document } = dom.window;

  const svg = document.querySelector('svg');
  //svg.style.fontFamily = 'Roboto';

  function isBarreChord() {
    return translated.translated.includes(0) ? false : true;
  }

  function setMiddleFretNumber() {
    const lowestFret = orderBy(
      translated.translated.filter((c) => c !== 'x'),
      (v) => v,
    );

    const fretNumber = document.querySelector('#fret-number');
    fretNumber.innerHTML =
      parseInt(lowestFret[0]) + (isBarreChord() ? 2 : 3);
  }

  function setUnusedStrings() {
    voicing.forEach((note) => {
      const string = strings.find((s) => s.index === note[0]);
      const stringEl = document.querySelector(`#${string.name}`);
      if (note[1] === 'x') {
        stringEl.setAttribute('style', 'fill: tomato');
      }
    });
  }

  function calcFretPosition(i) {
    const height = svg.getAttribute('height');
    const fretHeight = height / 5;
    const offset = fretHeight / 2;

    if (!isBarreChord()) i -= 1;

    return offset + i * fretHeight + 15;
  }

  function findNoteName(note) {
    return c.notes.find(
      (nn) => Note.get(nn).chroma === Note.get(note).chroma,
    );
  }

  function findHarmFunc(note) {
    const index = c.notes.findIndex(
      (nn) => Note.get(nn).chroma === Note.get(note).chroma,
    );

    const interval = Interval.get(c.intervals[index]);

    return interval.q + interval.num;
  }

  function addNotes() {
    const translatedFrets = translated.translated.reverse();
    voicing.forEach((item, index) => {
      if (item[1] === 'x') return false;
      const string = find(strings, (s) => s.index === item[0]);
      const stringEl = document.getElementById(string.name);
      const x = stringEl.getAttribute('x');
      const width = stringEl.getAttribute('width');
      const translatedItem = translatedFrets[index];
      const fretActive = parseInt(item[1]);

      //console.log(translatedItem, index);

      const transposed = Note.transpose(
        string.note,
        Interval.fromSemitones(translatedItem),
      );
      const note = Note.get(transposed);

      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      circle.setAttribute('r', 12);
      circle.style.fill = 'chartreuse';

      circle.setAttribute('cy', calcFretPosition(parseInt(item[1])));
      circle.setAttribute('cx', parseInt(x) + parseInt(width / 2));

      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text',
      );

      text.textContent = !options.harmFunc
        ? findNoteName(note.pc)
        : findHarmFunc(note.pc);

      text.setAttribute('y', calcFretPosition(parseInt(item[1])) + 6);
      text.setAttribute('x', parseInt(x) + parseInt(width / 2));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute(
        'style',
        'fill: rgb(0,0,0); font-size: 12px; text-anchor: middle; white-space: pre;',
      );

      circle.style.filter =
        'drop-shadow( 0px 0px 10px rgba(0, 0, 0, .7))';

      svg.appendChild(circle);
      svg.appendChild(text);
    });
  }

  setUnusedStrings();
  setMiddleFretNumber();
  addNotes();

  return document.querySelector('body').innerHTML;
}

module.exports = { generateVoicing };
