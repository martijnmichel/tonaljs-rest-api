import { Router } from 'express';
import _ from 'lodash';
import { ChordType, Chord } from '@tonaljs/tonal';
import { getVoicingsFromChord } from '@martijnmichel/chordshape';
import { generateVoicing } from '../scripts/voicing.generate';
import { generateChord } from '../scripts/chord.generate';
import { generateAudio } from '../scripts/generateAudio';
import sharp from 'sharp';

const encoded = (req, root, alias) =>
  `${req.context.url}/chord/${encodeURIComponent(
    root,
  )}/${encodeURIComponent(alias)}`;

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.chords));
});

router.get('/:alias', (req, res) => {
  let chord = Chord.getChord(req.params.alias);
  if (chord) return res.send(chord);
  else
    return res.send({
      empty: true,
    });
});

router.get('/:root/:alias', (req, res) => {
  const { root, alias } = req.params;

  const chord = Chord.getChord(alias, root);

  const voicings = getVoicingsFromChord(alias);

  return res.send({
    chord,
    voicings,
    images: {
      interactive: voicings.map(
        (v, i) =>
          `${encoded(req, root, alias)}/interactive?variant=${i}`,
      ),
      svg: voicings.map(
        (v, i) => `${encoded(req, root, alias)}/svg?variant=${i}`,
      ),
      png: voicings.map(
        (v, i) => `${encoded(req, root, alias)}/png?variant=${i}`,
      ),
      webp: voicings.map(
        (v, i) => `${encoded(req, root, alias)}/webp?variant=${i}`,
      ),
    },
  });
});

router.get('/mp3/:root/:alias', async (req, res) => {
  const { root, alias } = req.params;

  const { notes } = Chord.getChord(alias, root);
  console.log(notes);

  const data = await generateAudio(notes);

  return res.set('Content-Type', 'audio/webm;codecs=opus').send(data);
});

router.get('/:root/:alias/:imageType', async (req, res) => {
  const { voicing, harmFunc, frets, width } = req.query;

  const { root, alias, imageType } = req.params;

  const chord = Chord.getChord(alias, root);

  const data = voicing
    ? generateVoicing(chord, { voicing, harmFunc })
    : generateChord(chord, { harmFunc, frets });

  switch (imageType) {
    case 'interactive':
      return res.set('Content-Type', 'text/html').send(data);
    case 'svg':
      return res.set('Content-Type', 'image/svg').send(data);
    case 'png': {
      const imageData = await sharp(Buffer.from(data))
        .resize(parseInt(width || 246))
        .png()
        .toBuffer()
        .then((re) => re);

      return res.set('Content-Type', 'image/png').send(imageData);
    }
    case 'webp': {
      const imageData = await sharp(Buffer.from(data))
        .resize(parseInt(width || 246))
        .webp()
        .toBuffer()
        .then((re) => re);

      return res.set('Content-Type', 'image/webp').send(imageData);
    }
    default:
      return res.set('Content-Type', 'text/html').send(data);
  }
});

export default router;
