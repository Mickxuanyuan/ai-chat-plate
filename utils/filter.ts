type KeywordExtractor<T> = (item: T) => string[];

/**
 * Filter a record by keywords (case-insensitive substring match).
 */
export const filterWithKeywords = <T>(
  record: Record<string, T>,
  keywords: string,
  extractor: KeywordExtractor<T>,
): Record<string, T> => {
  const query = keywords.trim().toLowerCase();
  if (!query) return record;

  const result: Record<string, T> = {};

  for (const [key, item] of Object.entries(record)) {
    const haystack = extractor(item).join(" ").toLowerCase();
    if (haystack.includes(query)) result[key] = item;
  }

  return result;
};
