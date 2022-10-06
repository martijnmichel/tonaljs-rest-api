import puppeteer from 'puppeteer';
import * as Tone from 'tone';
import fs from 'fs';
import { Chord, ChordDictionary, Scale } from '@tonaljs/tonal';
import { resolve } from 'path';
function strToBuffer(str) {
  // Convert a UTF-8 String to an ArrayBuffer
  let buf = new ArrayBuffer(str.length); // 1 byte for each char
  let bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return Buffer.from(buf);
}

export const getAudioBuffer = async ({ notes }) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--use-fake-ui-for-media-stream',
      '--autoplay-policy=no-user-gesture-required',
    ],
    ignoreDefaultArgs: ['--mute-audio'],
  });

  const page = await browser.newPage();

  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.48/Tone.js',
  });

  const re = await page.evaluate(
    async ({ notes }) => {
      const recorder = new Tone.Recorder();
      const sampler = new Tone.Sampler({
        urls: {
          C2: 'C2.mp3',
          C3: 'C3.mp3',
          C4: 'C4.mp3',
          C5: 'C5.mp3',
          C6: 'C6.mp3',
        },
        baseUrl: 'https://tocadovision.nl/audio/index.php?note=',
        onerror: (e) => {
          console.log(e);
        },
        onload: () => {
          console.log('samples loaded');
        },
      }).connect(recorder);

      function arrayBufferToString(buffer) {
        // Convert an ArrayBuffer to an UTF-8 String
        let bufView = new Uint8Array(buffer);
        let length = bufView.length;
        let result = '';
        let addition = Math.pow(2, 8) - 1;

        for (var i = 0; i < length; i += addition) {
          if (i + addition > length) {
            addition = length - i;
          }
          result += String.fromCharCode.apply(
            null,
            bufView.subarray(i, i + addition),
          );
        }
        return result;
      }

      const delay = (ms) => new Promise((res) => setTimeout(res, ms));

      const waitForLoaded = () =>
        new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (sampler.loaded) {
              resolve();
              clearInterval(interval);
            }
          }, 250);
        });

      await waitForLoaded();

      // start recording
      recorder.start();

      // generate a few notes
      notes.forEach((note, i) => {
        sampler.triggerAttackRelease(note, 1, (i + 1) / 2);
      });
      // wait for the notes to end and stop the recording
      await delay(notes.length * 1000);
      const recording = await recorder.stop();

      const buffer = await recording.arrayBuffer();

      return arrayBufferToString(buffer);
    },
    { notes },
  );

  await page.close();

  await browser.close();

  const buffer = strToBuffer(re);

  console.log(buffer);

  return buffer;
};

const saveToDisk = async ({ notes, name }) => {
  const buffer = await getAudioBuffer({
    notes,
  });

  await new Promise((resolve) => {
    fs.writeFile(
      name + '.webm',
      buffer,
      () => console.log(' saved!'),
      resolve(),
    );
  });
};

const generateChords = async () => {
  const chords = ChordDictionary.all();

  for (let x = 0; x < chords.length; x++) {
    const chord = chords[x];
    const { notes, name } = Chord.getChord(chord.name, 'C3');

    console.log(`Generating chord: ${name} -> ${notes}`);

    await saveToDisk({ notes, name });
  }

  console.log('chords saved');
};

generateChords();
