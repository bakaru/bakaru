/**
 * Returns equal start and end parts of all strings
 *
 * Given the strings ["w 1 e", "w 2 e", "w 3 2 4 e"] will return ["w ", " e"]
 *
 * @param {string[]} strings
 * @returns {[string, string]}
 */
export default function findSameStringParts(strings: string[]): [string, string] {
  const stringsLength = strings.length;

  if (stringsLength === 1) {
    return ['', ''] as [string, string];
  }

  const firstStringLength = strings[0].length;

  const start = [];
  const end = [];

  let startDiffDetected = false;
  let endDiffDetected   = false;

  for (let i = 0; i < firstStringLength; i++) {
    const letterFromStart = strings[0][i];
    const letterFromEnd   = strings[0][firstStringLength - 1 - i];

    for (let stringIndex = 1; stringIndex < stringsLength; stringIndex++) {
      const stringLength = strings[stringIndex].length;

      if (!startDiffDetected) {
        startDiffDetected = strings[stringIndex][i] !== letterFromStart;
      }

      if (!endDiffDetected) {
        endDiffDetected = strings[stringIndex][stringLength - 1 - i] !== letterFromEnd;
      }

      if (startDiffDetected && endDiffDetected) {
        break;
      }
    }

    if (!startDiffDetected) {
      start[start.length] = letterFromStart;
    }

    if (!endDiffDetected) {
      end[end.length] = letterFromEnd;
    }

    if (startDiffDetected && endDiffDetected) {
      break;
    }
  }

  return [start.join(''), end.reverse().join('')] as [string, string];
}
