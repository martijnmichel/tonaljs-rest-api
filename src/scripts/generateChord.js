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
} = require('@tonaljs/tonal');
const { each } = require('lodash');
const sharp = require('sharp');
const { chordName } = require('../utils/chordName');
const { ChordBox } = require('./ChordBox');

function generateGuitarChord(c, variant) {
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

  const box = new ChordBox();
  const translated = translate(voicings[variant], c.tonic);

  const voicing = translated.shape
    .slice()
    .reverse()
    .map((n, i) => [i + 1, n]);

  box.draw({
    chord: voicing,
    position: translated.transposed,
    name: title,
  });

  const svg = box.getSVG();

  console.log(svg);

  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then((re) => re);
}

module.exports = { generateGuitarChord };
