import puppeteer from 'puppeteer';
import * as Tone from 'tone';
import fs from 'fs';
function strToBuffer(str) {
  // Convert a UTF-8 String to an ArrayBuffer
  let buf = new ArrayBuffer(str.length); // 1 byte for each char
  let bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return Buffer.from(buf);
}

export const generateAudio = async (notes) => {
  const browser = await puppeteer.launch({
    headless: true,
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
      const synth = new Tone.Synth().connect(recorder);

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

      // start recording
      recorder.start();
      // generate a few notes
      notes.forEach((note, i) => {
        synth.triggerAttackRelease(note, 0.5, i / 2);
      });
      // wait for the notes to end and stop the recording
      await delay(notes.length * 1000);
      const recording = await recorder.stop();

      const buffer = await recording.arrayBuffer();

      return arrayBufferToString(buffer);
    },
    { notes },
  );

  await browser.close();

  const buffer = strToBuffer(re);

  console.log(buffer);

  fs.writeFile('audio.webm', buffer, () =>
    console.log('video saved!'),
  );

  return buffer;
};

generateAudio(['C3', 'G3', 'E4', 'G4', 'D5']);
