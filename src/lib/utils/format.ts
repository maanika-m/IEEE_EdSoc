/**
 * Formatting and utility helpers for IEEE EdSoc SRMIST Chapter
 */

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatCategory(category?: string | null): string {
  if (!category) return 'General';
  switch (category) {
    case 'workshop':
      return 'Workshop';
    case 'seminar':
      return 'Seminar';
    case 'technical_session':
      return 'Technical Session';
    case 'meeting':
      return 'Meeting';
    case 'outreach':
      return 'Outreach';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
