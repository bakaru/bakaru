import naturalSort = require('javascript-natural-sort');
import fastLeneshtein = require('fast-levenshtein');

/**
 * Detects if given folder is a series
 *
 * @param {Bakaru.ClassifiedFolderItems} classifiedItems
 * @returns {boolean}
 */
export default function isSeries(classifiedItems: Bakaru.ClassifiedFolderItems) {
  const videos = classifiedItems.videos.slice().sort(naturalSort);
  const videosLength = videos.length;

  if (videosLength === 0) {
    return false;
  }

  const distances = [];
  const pairs = [];
  const percentile = .9;
  const lengths = [];

  for (let i = 0; i < videosLength; i++) {
    lengths.push(videos[i].length);
    
    for (let j = 0; j < videosLength; j++) {
      const compositeKey = `${i}${j}`;

      if (i === j || pairs.indexOf(compositeKey) > -1) {
        continue;
      } else {
        pairs[pairs.length] = compositeKey;
      }

      distances[distances.length] = fastLeneshtein.get(videos[i], videos[j]);
    }
  }

  distances.sort((a, b) => b - a);
  const index = Math.round(distances.length * percentile) + 1;
  const mean = distances.slice(0, index).reduce((acc, n) => acc + n, 0) / index;
  const meanLength = lengths.reduce((acc, n) => acc + n, 0) / lengths.length;

  // 90% times diff should be less than half length of the mean files name's length
  return mean < (meanLength / 2);
};
