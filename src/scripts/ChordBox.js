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
      fontFamily: 'Arial',
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
      .font({ size: textAttrs.size })
      .stroke(this.params.textColor)
      .fill(this.params.textColor)
      .font(textAttrs);

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