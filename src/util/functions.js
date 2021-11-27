const READING_RATE = 300 // Words per minute

export function calculateReadingTime(articleHTML) {
  const wordCount = articleHTML.split(" ").length;
  const readingMinutes = Math.round(wordCount / READING_RATE).toFixed()

  let indicators;

  if (readingMinutes < 5) {
    indicators = 1
  } else if (readingMinutes < 12) {
    indicators = 2
  } else if (readingMinutes < 25) {
    indicators = 3
  } else {
    indicators = 4
  }

  return [indicators, readingMinutes]
}