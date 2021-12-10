import { JSDOM } from 'jsdom';

export default function useJSDom() {
  const newDom = () => {
    return new JSDOM(
      `<!DOCTYPE html>
          
              
              <body>
                  <svg viewBox="0 0 246.324 361.625" width="246.324" height="361.625" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:bx="https://boxy-svg.com">
                      <defs>
                          <style bx:fonts="Roboto" bx:pinned="true">@import url(https://fonts.googleapis.com/css2?family=Roboto%3Aital%2Cwght%400%2C100%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C700%3B0%2C900%3B1%2C100%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C700%3B1%2C900&display=swap)</style>
                          
                          <linearGradient id="gradient-1" bx:pinned="true">
                          <stop offset="0" style="stop-color: rgb(223, 223, 223);"></stop>
                          <stop offset="1" style="stop-color: rgb(237, 237, 237);"></stop>
                          </linearGradient>
                          
                          <linearGradient id="gradient-0" bx:pinned="true">
                          <stop offset="0" style="stop-color: rgb(221, 221, 221);"></stop>
                          <stop offset="1" style="stop-color: rgb(186, 186, 186);"></stop>
                          </linearGradient>
          
                          <linearGradient id="gradient-string-ead" bx:pinned="true">
                            <stop offset="0" style="stop-color: rgb(146, 146, 146);"></stop>
                            <stop offset="0.5" style="stop-color: rgb(221, 221, 221); stop-opacity: 10%"></stop>
                            <stop offset="1" style="stop-color: rgb(146, 146, 146);"></stop>
                          </linearGradient>
          
                          <linearGradient id="gradient-string-gbe" bx:pinned="true">
                            <stop offset="1" style="stop-color: rgb(236, 236, 236);"></stop>
                            <stop offset="0" style="stop-color: rgb(221, 221, 221);"></stop>
                            <stop offset="1" style="stop-color: rgb(236, 236, 236);"></stop>
                          </linearGradient>
          
          
                          
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
                      <text style="fill: rgb(255, 255, 255); font-size: 12px; text-anchor: middle; white-space: pre;" x="125.389" y="193.929" id="fret-number">10</text>
                      <rect x="20.181" y="15" width="6.638" height="346.625" style="fill: url(#gradient-string-ead);" id="E2_string"></rect>
                      <rect x="61.273" y="15" width="5.566" height="346.625" style="fill: url(#gradient-string-ead);" id="A2_string"></rect>
                      <rect x="102.418" y="15" width="4.896" height="346.625" style="fill: url(#gradient-string-ead); paint-order: fill;" id="D3_string"></rect>
                      <rect x="143.444" y="15" width="4.226" height="346.625" style="fill: url(#gradient-string-gbe);" id="G3_string"></rect>
                      <rect x="185.336" y="15" width="3.69" height="346.625" style="fill: url(#gradient-string-gbe);" id="B3_string"></rect>
                      <rect x="225.52" y="15" width="2.619" height="346.625" style="fill: url(#gradient-string-gbe);" id="E4_string"></rect>
          
          
                  </svg>
              </body>
              `,
    );
  };

  const getStrings = () => {
    return [
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
  };

  return { newDom, getStrings };
}
