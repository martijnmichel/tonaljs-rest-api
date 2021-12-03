import { Router } from 'express';
import _ from 'lodash';
import { Chord } from '@tonaljs/modules';
import { generateGuitarChord } from '../scripts/generateChord';
import { ChordType } from '@tonaljs/tonal';
import { getVoicingsFromChord } from '@martijnmichel/chordshape';
import { generate } from '../scripts/generate';
import sharp from 'sharp';

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get('/:root/:chordAlias', (req, res) => {
  return res.send(
    Chord.chord(`${req.params.root}${req.params.chordAlias}`),
  );
});

router.get('/:root/:chroma/variants', async (req, res) => {
  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const data = getVoicingsFromChord(chord.aliases[0]);
  return res.send(data);
});

router.get('/test', (req, res) => {
  const c = Chord.getChord('M', 'D');

  res.send(generate(c, 0));
});

router.get('/:root/:chroma/interactive', async (req, res) => {
  const { variant } = req.query;

  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const c = Chord.getChord(chord.aliases[0], req.params.root);

  const data = generate(c, variant);

  return res.set('Content-Type', 'text/html').send(data);
});

router.get('/:root/:chroma/png', async (req, res) => {
  const { variant } = req.query;

  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const c = Chord.getChord(chord.aliases[0], req.params.root);
  console.log(c);
  const data = generate(c, variant);

  const imageData = await sharp(Buffer.from(data))
    .png()
    .toBuffer()
    .then((re) => re);

  return res.set('Content-Type', 'image/png').send(imageData);
});

router.get('/:chordAlias', (req, res) => {
  let chord = _.find(req.context.models.chords, (c) =>
    c.aliases.includes(req.params.chordAlias),
  );
  if (chord) return res.send(chord);
  else
    return res.send({
      empty: true,
    });
});
export default router;
