import { Router } from 'express';
import _ from 'lodash';
import { ChordType, Chord } from '@tonaljs/tonal';
import { getVoicingsFromChord } from '@martijnmichel/chordshape';
import { generateVoicing } from '../scripts/voicing.generate';
import { generateChord } from '../scripts/chord.generate';
import sharp from 'sharp';

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get('/:root/:chordAlias', (req, res) => {
  const chord = Chord.getChord(
    req.params.chordAlias,
    req.params.root,
  );

  const host = `${req.protocol}://${req.get('host')}/chord`;

  return res.send({
    ...chord,
    url: {
      variants: `${host}/${req.params.root}/${chord.chroma}/variants`,
      interactive: `${host}/${req.params.root}/${chord.chroma}/interactive?variant=0`,
    },
  });
});

router.get('/:root/:chroma/variants', async (req, res) => {
  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const host = `${req.protocol}://${req.get('host')}/chord`;

  const data = getVoicingsFromChord(chord.aliases[0]);
  return res.send(
    data.map((v, i) => {
      return {
        ...v,
        url: {
          png: `${host}/${req.params.root}/${chord.chroma}/png?variant=${i}`,
          interactive: `${host}/${req.params.root}/${chord.chroma}/interactive?variant=${i}`,
        },
      };
    }),
  );
});

router.get('/:root/:chroma/interactive', async (req, res) => {
  const { variant, harmFunc, frets } = req.query;

  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const c = Chord.getChord(chord.aliases[0], req.params.root);

  const data = variant
    ? generateVoicing(c, { variant, harmFunc })
    : generateChord(c, { harmFunc, frets });

  return res.set('Content-Type', 'text/html').send(data);
});

router.get('/:root/:chroma/svg', async (req, res) => {
  const { variant, harmFunc, frets } = req.query;

  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const c = Chord.getChord(chord.aliases[0], req.params.root);

  const data = variant
    ? generateVoicing(c, { variant, harmFunc })
    : generateChord(c, { harmFunc, frets });

  return res.set('Content-Type', 'image/svg').send(data);
});

router.get('/:root/:chroma/png', async (req, res) => {
  const { variant, width, harmFunc } = req.query;

  const chord = ChordType.all().find(
    (c) => c.chroma === req.params.chroma,
  );

  const c = Chord.getChord(chord.aliases[0], req.params.root);

  const data = variant
    ? generateVoicing(c, { variant, harmFunc })
    : undefined;

  const imageData = await sharp(Buffer.from(data))
    .resize(parseInt(width) || 246)
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
