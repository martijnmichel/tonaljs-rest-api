const {
  getVoicingsFromChord,
  translate,
} = require('@martijnmichel/chordshape');
const { Chord, Interval, Note } = require('@tonaljs/tonal');
const { orderBy, find } = require('lodash');

import useJSDom from '../composables/jsdom';

const options = {
  harmFunc: false,
  frets: 5,
  position: 0,
};

function generateChord(c, opts) {
  Object.assign(options, opts);

  const { getStrings, newDom } = useJSDom();
  const strings = getStrings();

  const chord = Chord.get(c.aliases[0]);
  let name = chord.name;
  if (name === '') name = chord.aliases[0];

  const dom = newDom();

  const { document } = dom.window;

  const svg = document.querySelector('svg');
  //svg.style.fontFamily = 'Roboto';

  function setMiddleFretNumber() {
    const fretNumber = document.querySelector('#fret-number');
    fretNumber.innerHTML = parseInt(options.position) + 3;
  }

  function calcFretPosition(i) {
    const height = svg.getAttribute('height');
    const fretHeight = height / 5;
    const offset = fretHeight / 2;

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

  function addHighlighted(stringEl, note, y) {
    const x = stringEl.getAttribute('x');
    const width = stringEl.getAttribute('width');

    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle',
    );
    circle.setAttribute('r', 12);
    circle.style.fill = 'chartreuse';

    circle.setAttribute('cy', y);
    circle.setAttribute('cx', parseInt(x) + parseInt(width / 2));

    const text = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text',
    );

    text.textContent = !options.harmFunc
      ? findNoteName(note.pc)
      : findHarmFunc(note.pc);

    text.setAttribute('y', y + 6);
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
  }

  function addNotes() {
    strings.forEach((string, index) => {
      const stringEl = document.getElementById(string.name);

      console.log(string);

      for (let x = 0; x < options.frets; x++) {
        const intervalFromOpen = Interval.fromSemitones(x);
        console.log(intervalFromOpen);
      }
    });
  }

  setMiddleFretNumber();
  addNotes();

  return document.querySelector('body').innerHTML;
}

module.exports = { generateChord };
