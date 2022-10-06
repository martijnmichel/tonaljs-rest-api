const puppeteer = require('puppeteer');
const Tone = require('tone');
const { AudioContext } = require('web-audio-api');

function strToBuffer(str) {
  // Convert a UTF-8 String to an ArrayBuffer
  let buf = new ArrayBuffer(str.length); // 1 byte for each char
  let bufView = new Uint8Array(buf);

  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return Buffer.from(buf);
}

export const generateAudio = async () => {
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

  const re = await page.evaluate(`(async () => {
    const recorder = new Tone.Recorder();
    const synth = new Tone.Synth().connect(recorder);

    function arrayBufferToString(buffer){ // Convert an ArrayBuffer to an UTF-8 String
      let bufView = new Uint8Array(buffer);
      let length = bufView.length;
      let result = '';
      let addition = Math.pow(2,8)-1;

      for(var i = 0;i<length;i+=addition){
          if(i + addition > length){
              addition = length - i;
          }
          result += String.fromCharCode.apply(null, bufView.subarray(i,i+addition));
      }
      return result;
  }

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    // start recording
    recorder.start();
    // generate a few notes
    synth.triggerAttackRelease('C3', 0.5);
    synth.triggerAttackRelease('C4', 0.5, '+1');
    synth.triggerAttackRelease('C5', 0.5, '+2');
    // wait for the notes to end and stop the recording
    await delay(5000);
    const recording = await recorder.stop();

    const buffer = await recording.arrayBuffer();

    return arrayBufferToString(buffer);
  })()`);

  await browser.close();

  const buffer = strToBuffer(re);

  return buffer;
};
