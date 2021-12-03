function generate() {
  const jsdom = require('jsdom');
  const { JSDOM } = jsdom;

  const dom = new JSDOM(
    `<!DOCTYPE html>
    
    <body>
    <svg viewBox="89.519 76.557 246.324 361.625" width="246.324" height="361.625" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">
    <defs>
      <style bx:fonts="Roboto" bx:pinned="true">@import url(https://fonts.googleapis.com/css2?family=Roboto%3Aital%2Cwght%400%2C100%3B0%2C300%3B0%2C400%3B0%2C500%3B0%2C700%3B0%2C900%3B1%2C100%3B1%2C300%3B1%2C400%3B1%2C500%3B1%2C700%3B1%2C900&amp;display=swap);</style>
    </defs>
    <rect x="89.519" y="76.557" width="246.324" height="361.625" style="fill: rgb(91, 102, 119);"></rect>
    <rect x="86.374" y="155.019" width="251.805" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
    <rect x="86.331" y="224.867" width="251.805" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
    <rect x="87.425" y="433.636" width="251.805" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
    <rect x="85.619" y="295.25" width="251.805" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
    <rect x="86.525" y="366.624" width="251.805" height="4.299" style="fill: rgb(216, 216, 216); fill-opacity: 0.3;"></rect>
    <rect x="88.227" y="75.548" width="248.442" height="14.765" style="fill: rgb(216, 216, 216);"></rect>
    <circle style="fill: rgb(216, 216, 216); fill-opacity: 0.21;" cx="209.115" cy="264.219" r="10.6"></circle>
    <text style="fill: rgb(255, 255, 255); font-family: Roboto; font-size: 12.5px; white-space: pre;" x="206.008" y="268.477">3</text>
    <rect x="108.638" y="88.589" width="6.638" height="349.595" style="fill: rgb(216, 216, 216);" id="E_string"></rect>
    <rect x="147.892" y="88.757" width="5.566" height="349.595" style="fill: rgb(216, 216, 216);" id="A_string"></rect>
    <rect x="188.037" y="88.572" width="4.896" height="349.595" style="fill: rgb(216, 216, 216);" id="D_string"></rect>
    <rect x="229.063" y="88.183" width="4.226" height="349.595" style="fill: rgb(216, 216, 216);" id="G_string"></rect>
    <rect x="268.955" y="88.395" width="3.69" height="349.595" style="fill: rgb(216, 216, 216);" id="B_string"></rect>
    <rect x="308.139" y="88.129" width="2.619" height="349.595" style="fill: rgb(216, 216, 216);" id="E4_string"></rect>
  </svg>
    </body>
    `,
  );
  const { document } = dom.window;

  return document.querySelector('body').innerHTML;
}

module.exports = { generate };
