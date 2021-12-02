function chordName(name) {
  let newName = name
    .replace(/#/g, 's')
    .replace('m/ma7', 'minor-major-7')
    .replace('mMaj', 'minor-major-')
    .replace('/', '');

  if (newName === 'm') newName = 'minor';
  if (newName === 'm7b5') newName = 'mi7b5';
  if (newName === 'M') newName = 'major';

  return newName;
}

module.exports = { chordName };
