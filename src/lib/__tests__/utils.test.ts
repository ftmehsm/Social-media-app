import {
  cn,
  formatRelativeDate,
  formatNumber,
  isUploadThingUrl,
  convertUploadThingUrl,
} from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });
  });

  describe('formatRelativeDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format recent dates (less than 24 hours) as relative time', () => {
      const now = new Date('2024-01-01T12:00:00Z');
      jest.setSystemTime(now);

      const oneHourAgo = new Date('2024-01-01T11:00:00Z');
      const result = formatRelativeDate(oneHourAgo, 'en');
      expect(result).toContain('hour');
    });

    it('should format dates from same year without year', () => {
      const now = new Date('2024-06-15T12:00:00Z');
      jest.setSystemTime(now);

      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatRelativeDate(date, 'en');
      expect(result).toMatch(/Jan\s+15/);
    });

    it('should format dates from different years with year', () => {
      const now = new Date('2024-06-15T12:00:00Z');
      jest.setSystemTime(now);

      const date = new Date('2023-01-15T12:00:00Z');
      const result = formatRelativeDate(date, 'en');
      expect(result).toMatch(/Jan\s+15,\s+2023/);
    });

    it('should use Persian locale when specified', () => {
      const now = new Date('2024-01-01T12:00:00Z');
      jest.setSystemTime(now);

      const oneHourAgo = new Date('2024-01-01T11:00:00Z');
      const result = formatRelativeDate(oneHourAgo, 'fa');
      expect(result).toBeTruthy();
    });
  });

  describe('formatNumber', () => {
    it('should format small numbers', () => {
      expect(formatNumber(123)).toBe('123');
    });

    it('should format thousands with K', () => {
      expect(formatNumber(1234)).toBe('1.2K');
    });

    it('should format millions with M', () => {
      expect(formatNumber(1234567)).toBe('1.2M');
    });

    it('should format billions with B', () => {
      expect(formatNumber(1234567890)).toBe('1.2B');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('isUploadThingUrl', () => {
    it('should return true for utfs.io URLs', () => {
      expect(isUploadThingUrl('https://utfs.io/f/abc123')).toBe(true);
    });

    it('should return true for .ufs.sh URLs', () => {
      expect(isUploadThingUrl('https://app.ufs.sh/a/appId/fileKey')).toBe(true);
    });

    it('should return false for non-UploadThing URLs', () => {
      expect(isUploadThingUrl('https://example.com/image.jpg')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isUploadThingUrl(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isUploadThingUrl(undefined)).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isUploadThingUrl('not-a-url')).toBe(false);
    });
  });

  describe('convertUploadThingUrl', () => {
    it('should convert old format to new format', () => {
      const oldUrl = 'https://app.ufs.sh/a/appId/fileKey';
      const result = convertUploadThingUrl(oldUrl);
      expect(result).toBe('https://utfs.io/f/fileKey');
    });

    it('should convert old format with nested paths', () => {
      const oldUrl = 'https://app.ufs.sh/a/appId/path/to/fileKey';
      const result = convertUploadThingUrl(oldUrl);
      expect(result).toBe('https://utfs.io/f/path/to/fileKey');
    });

    it('should return new format URLs unchanged', () => {
      const newUrl = 'https://utfs.io/f/fileKey';
      const result = convertUploadThingUrl(newUrl);
      expect(result).toBe(newUrl);
    });

    it('should return non-UploadThing URLs unchanged', () => {
      const url = 'https://example.com/image.jpg';
      const result = convertUploadThingUrl(url);
      expect(result).toBe(url);
    });

    it('should return null for null input', () => {
      expect(convertUploadThingUrl(null)).toBeNull();
    });

    it('should return undefined for undefined input', () => {
      expect(convertUploadThingUrl(undefined)).toBeUndefined();
    });

    it('should handle invalid URLs gracefully', () => {
      const invalidUrl = 'not-a-url';
      const result = convertUploadThingUrl(invalidUrl);
      expect(result).toBe(invalidUrl);
    });
  });
});

