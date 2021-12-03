const strings = [
  {
    name: 'E2_string',
    note: 'E2',
    index: 6,
  },
  {
    name: 'A2_string',
    note: 'a2',
    index: 5,
  },
  {
    name: 'D3_string',
    note: 'd3',
    index: 4,
  },
  {
    name: 'G3_string',
    note: 'g3',
    index: 3,
  },
  {
    name: 'B3_string',
    note: 'b3',
    index: 2,
  },
  {
    name: 'E4_string',
    note: 'E4',
    index: 1,
  },
];

function generate(c, variant) {
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;
  const {
    getVoicingsFromChord,
    translate,
  } = require('@martijnmichel/chordshape');
  const {
    ChordType,
    Chord,
    Scale,
    distance,
    Interval,
    ScaleType,
    Note,
  } = require('@tonaljs/tonal');
  const { each, orderBy, find } = require('lodash');
  const sharp = require('sharp');
  const { chordName } = require('../utils/chordName');

  const chord = Chord.get(c.aliases[0]);
  let name = chord.name;
  if (name === '') name = chord.aliases[0];

  const voicings = getVoicingsFromChord(chord.aliases[0]);

  if (voicings) {
    console.log(`Generating images for chord: ${name}`);
  } else {
    console.log(`NO VOICINGS FOUND FOR: ${name}`);
  }

  //const fname = c.tonic + ' ' + chordName(name);

  const title = c.tonic + c.aliases[0];

  const translated = translate(voicings[variant], c.tonic);

  const voicing = translated.shape
    .slice()
    .reverse()
    .map((n, i) => [i + 1, n]);

  const dom = new JSDOM(
    `<!DOCTYPE html>
    <body>
        <svg viewBox="0 0 246.324 361.625" width="246.324" height="361.625" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">
            <defs>
                <style bx:fonts="Roboto" bx:pinned="true">@import url(https://fonts.googleapis.com/css2?family=Roboto%3Aital%2Cwght%400%2C100%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C700%3B0%2C900%3B1%2C100%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C700%3B1%2C900)</style>
                
                <linearGradient id="gradient-1" bx:pinned="true">
                <stop offset="0" style="stop-color: rgb(223, 223, 223);"></stop>
                <stop offset="1" style="stop-color: rgb(237, 237, 237);"></stop>
                </linearGradient>
                <radialGradient id="gradient-1-0" gradientUnits="userSpaceOnUse" cx="231.176" cy="262.98" r="2.113" gradientTransform="matrix(1, 0, 0, 0.991504, -85.618988, -72.434156)" xlink:href="#gradient-1"></radialGradient>
                <radialGradient id="gradient-1-1" gradientUnits="userSpaceOnUse" cx="270.8" cy="263.192" r="1.845" gradientTransform="matrix(1, 0, 0, 0.991504, -83.618988, -72.644036)" xlink:href="#gradient-1"></radialGradient>
                <radialGradient id="gradient-1-2" gradientUnits="userSpaceOnUse" cx="309.449" cy="262.926" r="1.309" gradientTransform="matrix(1, 0, 0, 0.991504, -82.618988, -72.380296)" xlink:href="#gradient-1"></radialGradient>
                <linearGradient id="gradient-0" bx:pinned="true">
                <stop offset="0" style="stop-color: rgb(221, 221, 221);"></stop>
                <stop offset="1" style="stop-color: rgb(186, 186, 186);"></stop>
                </linearGradient>
                <radialGradient id="gradient-0-0" gradientUnits="userSpaceOnUse" cx="190.485" cy="264.369" r="2.448" spreadMethod="pad" gradientTransform="matrix(1, 0, 0, 0.991504, -85.618988, -73.811038)" xlink:href="#gradient-0"></radialGradient>
                <radialGradient id="gradient-0-1" gradientUnits="userSpaceOnUse" cx="150.675" cy="263.555" r="2.783" gradientTransform="matrix(1, 0, 0, 0.991504, -86.618988, -73.00296)" xlink:href="#gradient-0"></radialGradient>
                <radialGradient id="gradient-0-2" gradientUnits="userSpaceOnUse" cx="111.957" cy="263.386" r="3.319" gradientTransform="matrix(1, 0, 0, 0.991504, -88.456985, -72.836388)" xlink:href="#gradient-0"></radialGradient>
                <bx:grid x="-16.946" y="6.197" width="40.842" height="192.871"></bx:grid>
                <bx:guide x="486.923" y="134.308" angle="0"></bx:guide>
            </defs>
            <rect y="0" width="246.324" height="361.625" style="fill: rgb(62, 82, 112);"></rect>
            <rect y="79.471" width="246.324" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
            <rect y="149.319" width="246.324" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
            <rect y="358.088" width="246.324" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
            <rect y="219.702" width="246.324" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
            <rect y="291.076" width="246.324" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
            <rect width="246.324" height="15" style="fill: rgb(216, 216, 216);"></rect>
            <circle style="fill: rgb(216, 216, 216); fill-opacity: 0.21;" cx="125.496" cy="188.671" r="10.6"></circle>
            <text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: 12px; text-anchor: middle; white-space: pre;" x="125.389" y="193.929" id="fret-number">10</text>
            <rect x="20.181" y="15" width="6.638" height="346.625" style="fill: url(#gradient-0-2);" id="E2_string"></rect>
            <rect x="61.273" y="15" width="5.566" height="346.625" style="fill: url(#gradient-0-1);" id="A2_string"></rect>
            <rect x="102.418" y="15" width="4.896" height="346.625" style="fill: url(#gradient-0-0); paint-order: fill;" id="D3_string"></rect>
            <rect x="143.444" y="15" width="4.226" height="346.625" style="fill: url(#gradient-1-0);" id="G3_string"></rect>
            <rect x="185.336" y="15" width="3.69" height="346.625" style="fill: url(#gradient-1-1);" id="B3_string"></rect>
            <rect x="225.52" y="15" width="2.619" height="346.625" style="fill: url(#gradient-1-2);" id="E4_string"></rect>
        </svg>
    </body>
    `,
  );
  const { document } = dom.window;

  const svg = document.querySelector('svg');
  svg.setAttribute('style', 'border-radius: 12px');

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

  function addNotes() {
    voicing.forEach((item, index) => {
      if (item[1] === 'x') return false;
      const string = find(strings, (s) => s.index === item[0]);
      const stringEl = document.getElementById(string.name);
      const x = stringEl.getAttribute('x');
      const width = stringEl.getAttribute('width');
      const translatedItem = translated.translated[index];
      const fretActive = parseInt(item[1]);

      console.log(translatedItem);

      const transposed = Note.transpose(
        string.note,
        Interval.fromSemitones(fretActive),
      );
      const note = Note.get(transposed);

      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      circle.setAttribute('r', 10);
      circle.style.fill = 'chartreuse';

      circle.setAttribute('cy', calcFretPosition(parseInt(item[1])));
      circle.setAttribute('cx', parseInt(x) + parseInt(width / 2));

      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text',
      );
      text.textContent = note.pc;

      text.setAttribute('y', calcFretPosition(parseInt(item[1])) + 6);
      text.setAttribute('x', parseInt(x) + parseInt(width / 2));
      text.setAttribute('text-anchor', 'middle');

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

module.exports = { generate };
