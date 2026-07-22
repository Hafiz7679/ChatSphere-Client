const SPAM_PATTERNS = [
  /(buy|cheap|free|click here|limited offer|act now)/i,
  /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}){3,}/g,
  /(http|https|www\.).{30,}/g,
  /(call|text|message)\s*(now|today|immediately)/i,
  /(congratulations|you won|you've won|winner)/i,
];

const SPAM_THRESHOLD = 2;

export const isSpam = (text) => {
  if (!text) return false;
  let matches = 0;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      matches++;
    }
  }
  return matches >= SPAM_THRESHOLD;
};

export const getSpamScore = (text) => {
  if (!text) return 0;
  let score = 0;
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      score++;
    }
  }
  return score;
};
