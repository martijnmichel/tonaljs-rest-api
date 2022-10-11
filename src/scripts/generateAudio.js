import puppeteer from 'puppeteer';
import * as Tone from 'tone';
import fs from 'fs';
import { Chord, ChordDictionary, Scale } from '@tonaljs/tonal';

import inquirer from 'inquirer';
import _ from 'lodash';
import { notes } from '../models/notes.js';
import sanitize from 'sanitize-filename';

const minimal_args = [
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',

  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

function strToBuffer(str) {
  // Convert a UTF-8 String to an ArrayBuffer
  let buf = new ArrayBuffer(str.length); // 1 byte for each char
  let bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return Buffer.from(buf);
}

export const getAudioBuffer = async ({
  notes,
  type = 'harmonic',
}) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      ...minimal_args,
      '--use-fake-ui-for-media-stream',
      '--autoplay-policy=no-user-gesture-required',
    ],
    ignoreDefaultArgs: ['--mute-audio'],
  });

  const page = await browser.newPage();

  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.48/Tone.js',
  });

  await page.waitForFunction('window.Tone !== undefined');

  const re = await page.evaluate(
    async ({ notes, type }) => {
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
      });

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

      const recorder = new Tone.Recorder();
      sampler.connect(recorder);

      // start recording
      recorder.start();

      if (type === 'harmonic') {
        const chordEvent = new Tone.ToneEvent((time, chord) => {
          // the chord as well as the exact time of the event
          // are passed in as arguments to the callback function
          sampler.triggerAttackRelease(chord, 2, time);
        }, notes);
        // start the chord at the beginning of the transport timeline
        chordEvent.start();
      } else {
        new Tone.Part(
          function (time, value) {
            //the value is an object which contains both the note and the velocity
            sampler.triggerAttackRelease(
              value.note,
              '4n',
              time,
              value.velocity,
            );
          },

          notes.map((note, i) => ({
            time: `0:${i}`,
            note,
            velocity: 0.9,
          })),
        ).start(1);
      }

      Tone.Transport.start();

      // wait for the notes to end and stop the recording
      await delay(notes.length * 1000);
      const recording = await recorder.stop();

      const buffer = await recording.arrayBuffer();

      return arrayBufferToString(buffer);
    },
    { notes, type },
  );

  await page.close();

  await browser.close();

  const buffer = strToBuffer(re);

  return buffer;
};

const dir = '../../dist/audio/piano/chords';

const saveToDisk = async ({ buffer, path }) => {
  await new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (err) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        console.log('Saved!');
        resolve(true);
      }
    });
  });
};

const generateChords = async (
  chords,
  notes,
  { overwriteExisting, type } = {},
) => {
  for (let y = 0; y < notes.length; y++) {
    const root = notes[y];

    for (let x = 0; x < chords.length; x++) {
      const chord = chords[x];
      const { notes, name, aliases } = Chord.getChord(
        chord,
        `${root}3`,
      );

      const chordName = `${name} ${aliases[0]}`;

      const dir = `../../dist/audio/piano/chords/${type}/${root}/`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const path = `${dir}/${sanitize(chordName)}.webm`;

      const fileExists = fs.existsSync(path);

      const { size } = fs.statSync(path);

      if (!fileExists || size < 1024 || overwriteExisting) {
        console.log(`Generating chord: ${chordName} -> ${notes}`);

        const buffer = await getAudioBuffer({
          notes,
          type,
        });

        await saveToDisk({
          path,
          buffer,
        });
      } else {
        console.log(`Using existing chord: ${chordName} -> ${size}`);
      }
    }
  }

  console.log('Chords saved! :)');
};

const cli = async () => {
  const { generate } = await inquirer.prompt([
    {
      type: 'list',
      name: 'generate',
      message: 'What do you want to do?',
      choices: ['chords', 'scales', 'intervals'],
    },
  ]);

  console.log(generate);

  if (generate === 'chords') {
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select Chords',
        name: 'chords',
        choices: _.map(
          ChordDictionary.all(),
          ({ name, aliases }) => ({
            name: name || aliases[0],
          }),
        ),
      },

      {
        type: 'checkbox',
        message: 'Select Notes',
        name: 'notes',
        choices: notes,
      },

      {
        type: 'list',
        name: 'type',
        message: 'Play the notes harmonically or melodically?',
        choices: ['harmonic', 'melodic'],
      },

      {
        type: 'list',
        name: 'overwriteExisting',
        message: 'Overwrite existing?',
        choices: ['Yes', 'No'],
      },
    ]);

    generateChords(answers.chords, answers.notes, {
      type: answers.type,
      overwriteExisting: answers.overwriteExisting === 'Yes',
    });
  }
};

cli();
