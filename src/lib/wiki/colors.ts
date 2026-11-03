export const CLASSIFICATION_COLORS: Record<string, string> = {
  concept: '#38bdf8',
  source: '#fbbf24',
  synthesis: '#c084fc',
  question: '#34d399',
  index: '#f472b6',
  log: '#94a3b8',
};

export const DEFAULT_CLASSIFICATION_COLOR = '#94a3b8';

export function getClassificationColor(classification: string): string {
  if (!classification) return DEFAULT_CLASSIFICATION_COLOR;
  const key = classification.toLowerCase();
  return CLASSIFICATION_COLORS[key] || DEFAULT_CLASSIFICATION_COLOR;
}
