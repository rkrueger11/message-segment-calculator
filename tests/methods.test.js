const { SegmentedMessage } = require('../dist');

describe('Test SegmentedMessage methods', () => {
  describe('getNonGsmCharacters()', () => {
    it('returns the non-GSM char from a simple mixed message', () => {
      const segmentedMessage = new SegmentedMessage('más');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual(['á']);
    });

    it('returns [] for an empty string', () => {
      const segmentedMessage = new SegmentedMessage('');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual([]);
    });

    it('returns [] for an all-GSM-7 message', () => {
      const segmentedMessage = new SegmentedMessage('hello world');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual([]);
    });

    it('returns multiple distinct non-GSM chars', () => {
      // á and ú are both non-GSM-7; é happens to be in the GSM-7 charset
      const segmentedMessage = new SegmentedMessage('más súper');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual(['á', 'ú']);
    });

    it('returns duplicate entries when the same non-GSM char appears more than once', () => {
      const segmentedMessage = new SegmentedMessage('áá');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual(['á', 'á']);
    });

    it('returns all chars when every character is non-GSM', () => {
      const segmentedMessage = new SegmentedMessage('Áú');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual(['Á', 'ú']);
    });

    it('returns the emoji when the message contains one', () => {
      const segmentedMessage = new SegmentedMessage('hello 😀');
      expect(segmentedMessage.getNonGsmCharacters()).toEqual(['😀']);
    });
  });

  describe('getEncodingName()', () => {
    it('returns "GSM-7" for a GSM-7 message', () => {
      const segmentedMessage = new SegmentedMessage('hello');
      expect(segmentedMessage.getEncodingName()).toBe('GSM-7');
    });

    it('returns "UCS-2" for a message containing a non-GSM-7 character', () => {
      const segmentedMessage = new SegmentedMessage('á');
      expect(segmentedMessage.getEncodingName()).toBe('UCS-2');
    });

    it('return value matches the encodingName property', () => {
      const segmentedMessage = new SegmentedMessage('hello');
      expect(segmentedMessage.getEncodingName()).toBe(segmentedMessage.encodingName);
    });
  });

  describe('lineBreakStyle property', () => {
    it('is undefined when there are no line breaks', () => {
      const segmentedMessage = new SegmentedMessage('hello world');
      expect(segmentedMessage.lineBreakStyle).toBeUndefined();
    });

    it('is "LF" when the message contains only Unix-style line feeds', () => {
      const segmentedMessage = new SegmentedMessage('hello\nworld');
      expect(segmentedMessage.lineBreakStyle).toBe('LF');
    });

    it('is "LF+CRLF" when the message contains a Windows-style CRLF sequence', () => {
      // \r\n contains \n, so both hasWindowsStyle and hasUnixStyle are detected
      const segmentedMessage = new SegmentedMessage('hello\r\nworld');
      expect(segmentedMessage.lineBreakStyle).toBe('LF+CRLF');
    });

    it('is "LF+CRLF" when the message contains both CRLF and a standalone LF', () => {
      const segmentedMessage = new SegmentedMessage('hello\r\nworld\nbye');
      expect(segmentedMessage.lineBreakStyle).toBe('LF+CRLF');
    });
  });
});
