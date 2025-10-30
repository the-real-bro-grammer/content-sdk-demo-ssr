export const formatListingID = (id: string): string => {
  if (!id) {
    return '';
  }

  let normalized = id.trim().toUpperCase();

  if (normalized.startsWith('{') && normalized.endsWith('}')) {
    normalized = normalized.substring(1, normalized.length - 1);
  }

  const compact = normalized.replace(/-/g, '');

  if (/^[0-9A-F]{32}$/.test(compact)) {
    normalized = `${compact.substring(0, 8)}-${compact.substring(8, 12)}-${compact.substring(
      12,
      16
    )}-${compact.substring(16, 20)}-${compact.substring(20)}`;
  }

  return `{${normalized}}`;
};
