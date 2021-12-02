const { createSVGWindow, config } = require('svgdom');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
/*
config
  .setFontDir("/System/Library/Fonts/")
  // map the font-family to the file
  .setFontFamilyMappings({
    Arial: "Supplemental/Arial.ttf",
    Helvetica: "Supplemental/Arial.ttf",
  })
  // you can preload your fonts to avoid the loading delay
  // when the font is used the first time
  .preloadFonts();
  */

class ChordBox {
  // sel can be a selector or an element.
  constructor(sel, params) {
    this.window = createSVGWindow();
    this.document = this.window.document;
    registerWindow(this.window, this.document);
    this.sel = sel;
    this.params = {
      numStrings: 6,
      numFrets: 5,
      x: 0,
      y: 0,
      width: 200,
      height: 250,
      strokeWidth: 1,
      showTuning: true,
      defaultColor: '#555',
      defaultFretColor: '#28849e',
      bgColor: '#fff',
      labelColor: '#fff',
      fontFamily: 'Roboto',
      fontSize: undefined,
      fontStyle: 'light',
      fontWeight: '100',
      labelWeight: '100',

      ...params,
    };

    // Setup defaults if not specifically overridden
    [
      'bridgeColor',
      'stringColor',
      'fretColor',
      'strokeColor',
      'textColor',
    ].forEach((param) => {
      this.params[param] =
        this.params[param] || this.params.defaultColor;
    });

    ['stringWidth', 'fretWidth'].forEach((param) => {
      this.params[param] =
        this.params[param] || this.params.strokeWidth;
    });

    var font_name = 'Roboto';
    var font_size = 48;
    //var font_path = 'NothingYouCouldSay.ttf';
    //var font_format = 'truetype';
    var font_format = 'woff2'; // best compression
    var font_mimetype = 'font/' + font_format;

    // https://www.1001fonts.com/nothing-you-could-say-font.html
    // minimal subset of glyphs: helo:)
    // extracted with fontforge
    var font_data =
      'data:font/woff2;base64,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';

    // embed font into css

    var newStyle = this.document.createElement('style');
    newStyle.setAttribute('type', 'text/css');
    newStyle.appendChild(
      this.document.createTextNode(
        '@font-face {' +
          "  font-family: '" +
          font_name +
          "';" +
          "  src: url('" +
          font_data +
          "')" +
          "    format('" +
          font_format +
          "')" +
          '  ;' +
          '}',
      ),
    );

    // Create canvas and add it to the DOM
    this.canvas = SVG(this.document.documentElement).size(
      this.params.width,
      this.params.height,
    );

    // Size and shift board
    this.width = this.params.width * 0.82;
    this.height = this.params.height * 0.82;

    // Initialize scaled-spacing
    this.numStrings = this.params.numStrings;
    this.numFrets = this.params.numFrets;
    this.spacing = this.width / this.numStrings;
    this.fretSpacing = this.height / (this.numFrets + 2);

    // Add room on sides for finger positions on 1. and 6. string
    this.x =
      this.params.x + this.params.width * 0.15 + this.spacing / 2;
    this.y =
      this.params.y + this.params.height * 0.15 + this.fretSpacing;

    this.metrics = {
      circleRadius: this.width / 20,
      barreRadius: this.width / 25,
      fontSize: this.params.fontSize || Math.ceil(this.width / 8),
      barShiftX: this.width / 28,
      bridgeStrokeWidth: Math.ceil(this.height / 36),
    };

    // Content
    this.position = 0;
    this.positionText = 0;
    this.chord = [];
    this.barres = [];
    this.tuning = ['E', 'A', 'D', 'G', 'B', 'e'];
  }

  getSVG() {
    return this.canvas.svg();
  }

  drawText(x, y, msg, attrs) {
    const textAttrs = {
      ...{
        family: this.params.fontFamily,
        size: this.metrics.fontSize,
        style: this.params.fontStyle,
        weight: this.params.fontWeight,
      },
      ...attrs,
    };

    const text = this.canvas
      .text(`${msg}`)
      .font({ size: textAttrs.size, family: 'Roboto' })
      .stroke(this.params.textColor)
      .fill(this.params.textColor);

    return text.move(x - text.length() / 2, y);
  }

  drawLine(x, y, newX, newY) {
    return this.canvas.line(0, 0, newX - x, newY - y).move(x, y);
  }

  draw({ chord, position, barres, positionText, tuning, name }) {
    this.chord = chord;
    this.position = position || 0;
    this.positionText = positionText || 0;
    this.barres = barres || [];
    this.tuning = tuning || ['E', 'A', 'D', 'G', 'B', 'E'];
    if (this.tuning.length === 0) {
      this.fretSpacing = this.height / (this.numFrets + 1);
    }

    const { spacing } = this;
    const { fretSpacing } = this;

    // draw chord title
    this.drawText(this.params.width / 2, 0, name, { size: 22 });

    // Draw guitar bridge
    if (this.position <= 1) {
    } else {
      // Draw position number
      this.drawText(
        this.x - this.spacing / 2 - this.spacing * 0.1,
        this.y + this.fretSpacing * this.positionText,
        this.position,
      );
    }

    // Draw strings
    for (let i = 0; i < this.numStrings; i += 1) {
      this.drawLine(
        this.x + spacing * i,
        this.y,
        this.x + spacing * i,
        this.y + fretSpacing * this.numFrets,
      ).stroke({
        width: this.params.stringWidth,
        color: this.params.stringColor,
      });
    }

    // Draw frets
    for (let i = 0; i < this.numFrets + 1; i += 1) {
      this.drawLine(
        this.x,
        this.y + fretSpacing * i,
        this.x + spacing * (this.numStrings - 1),
        this.y + fretSpacing * i,
      ).stroke({
        width: this.params.fretWidth,
        color: this.params.fretColor,
      });
    }

    // Draw tuning keys
    if (this.params.showTuning && this.tuning.length !== 0) {
      for (
        let i = 0;
        i < Math.min(this.numStrings, this.tuning.length);
        i += 1
      ) {
        this.drawText(
          this.x + this.spacing * i,
          this.y +
            this.numFrets * this.fretSpacing +
            this.fretSpacing / 12,
          this.tuning[i],
          { size: 15 },
        );
      }
    }

    // Draw chord
    for (let i = 0; i < this.chord.length; i += 1) {
      // Light up string, fret, and optional label.
      this.lightUp({
        string: this.chord[i][0],
        fret: this.chord[i][1],
        label: this.chord.length > 2 ? this.chord[i][2] : undefined,
      });
    }

    // Draw barres
    for (let i = 0; i < this.barres.length; i += 1) {
      this.lightBar(
        this.barres[i].fromString,
        this.barres[i].toString,
        this.barres[i].fret,
      );
    }
  }

  lightUp({ string, fret, label }) {
    const stringNum = this.numStrings - string;
    const shiftPosition =
      this.position === 1 && this.positionText === 1
        ? this.positionText
        : 0;

    const mute = fret === 'x';
    const fretNum = fret === 'x' ? 0 : fret - shiftPosition;

    const x = this.x + this.spacing * stringNum;
    let y = this.y + this.fretSpacing * fretNum;

    if (fretNum === 0) {
      y -= this.metrics.bridgeStrokeWidth;
    }

    if (!mute) {
      this.canvas
        .circle()
        .move(x, y - this.fretSpacing / 2 + (fretNum > 0 ? 0 : 8))
        .radius(this.params.circleRadius || this.metrics.circleRadius)
        .stroke({
          color: this.params.strokeColor,
          width: this.params.strokeWidth,
        })
        .fill(this.params.defaultFretColor);
    } else {
      this.drawText(x, y - this.fretSpacing - 20, 'x');
    }

    if (label) {
      const fontSize = this.metrics.fontSize * 0.55;
      const textYShift = fontSize * 0.66;
      this.drawText(x, y - this.fretSpacing / 2 - textYShift, label, {
        weight: this.params.labelWeight,
        size: fontSize,
      })
        .stroke({
          width: 0.7,
          color:
            fretNum !== 0
              ? this.params.labelColor
              : this.params.strokeColor,
        })
        .fill(
          fretNum !== 0
            ? this.params.labelColor
            : this.params.strokeColor,
        );
    }

    return this;
  }

  lightBar(stringFrom, stringTo, theFretNum) {
    let fretNum = theFretNum;
    if (this.position === 1 && this.positionText === 1) {
      fretNum -= this.positionText;
    }

    const stringFromNum = this.numStrings - stringFrom;
    const stringToNum = this.numStrings - stringTo;

    const x =
      this.x + this.spacing * stringFromNum - this.metrics.barShiftX;
    const xTo =
      this.x + this.spacing * stringToNum + this.metrics.barShiftX;

    const y =
      this.y +
      this.fretSpacing * (fretNum - 1) +
      this.fretSpacing / 4;
    const yTo =
      this.y +
      this.fretSpacing * (fretNum - 1) +
      (this.fretSpacing / 4) * 3;

    this.canvas
      .rect(xTo - x, yTo - y)
      .move(x, y)
      .radius(this.metrics.barreRadius)
      .fill(this.params.strokeColor);

    return this;
  }
}

module.exports = { ChordBox };
