export function parseTime(time: string): number {
  return parseInt(parseFloat(time) * 1000, 10);
}

export function parseVideoStream(video: any) {

}

export function parseAudioStream(audio: any) {

}

/**
 * Parses chapters to suitable objects
 *
 * @param {{}[]} chapters
 * @returns {Chapter[]}
 */
export function parseChapters(chapters: {}[]) {
  if (chapters.length === 0) {
    return [];
  }

  return chapters.map(rawChapter => {
    let title = '';

    // An attempt to get fine title for chapter
    if (rawChapter.tags) {
      if (rawChapter.tags.title) {
        title = rawChapter.tags.title.toString().trim();
      }
    }

    const start = parseTime(rawChapter.start_time);
    const end = parseTime(rawChapter.end_time);

    return coreObjectsCreators.chapter(title, start, end);
  });
}
