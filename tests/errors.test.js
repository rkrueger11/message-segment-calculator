const { SegmentedMessage } = require('../dist');

describe('Invalid encoding parameter', () => {
  it('throws for ASCII encoding', () => {
    expect(() => new SegmentedMessage('hello', 'ASCII')).toThrow();
  });

  it('throws for ISO-8859-1 encoding', () => {
    expect(() => new SegmentedMessage('hello', 'ISO-8859-1')).toThrow();
  });

  it('throws for utf8 encoding', () => {
    expect(() => new SegmentedMessage('hello', 'utf8')).toThrow();
  });
});

describe('GSM-7 encoding with incompatible characters', () => {
  it('throws with incompatible message for accented character', () => {
    expect(() => new SegmentedMessage('más', 'GSM-7')).toThrow(/incompatible with GSM-7/);
  });

  it('throws for emoji with GSM-7 encoding', () => {
    expect(() => new SegmentedMessage('hello 😀', 'GSM-7')).toThrow();
  });
});

describe('Empty string input', () => {
  it('does not throw for empty string', () => {
    expect(() => new SegmentedMessage('')).not.toThrow();
  });

  it('has segmentsCount of 1 for empty string', () => {
    const msg = new SegmentedMessage('');
    expect(msg.segmentsCount).toBe(1);
  });

  it('has numberOfCharacters of 0 for empty string', () => {
    const msg = new SegmentedMessage('');
    expect(msg.numberOfCharacters).toBe(0);
  });

  it('has numberOfUnicodeScalars of 0 for empty string', () => {
    const msg = new SegmentedMessage('');
    expect(msg.numberOfUnicodeScalars).toBe(0);
  });

  it('has encodingName of GSM-7 for empty string', () => {
    const msg = new SegmentedMessage('');
    expect(msg.encodingName).toBe('GSM-7');
  });
});

describe('Warnings behavior', () => {
  it('has empty warnings array for plain ASCII message with no line breaks', () => {
    const msg = new SegmentedMessage('Hello world');
    expect(msg.warnings).toEqual([]);
  });

  it('has undefined lineBreakStyle for message with no line breaks', () => {
    const msg = new SegmentedMessage('Hello world');
    expect(msg.lineBreakStyle).toBeUndefined();
  });

  it('has warnings.length of 1 for message with LF', () => {
    const msg = new SegmentedMessage('Hello\nworld');
    expect(msg.warnings.length).toBe(1);
  });

  it('has warnings.length of 1 for message with CRLF', () => {
    const msg = new SegmentedMessage('Hello\r\nworld');
    expect(msg.warnings.length).toBe(1);
  });

  it('has lineBreakStyle of LF for message with only LF', () => {
    const msg = new SegmentedMessage('Hello\nworld');
    expect(msg.lineBreakStyle).toBe('LF');
  });

  it('has lineBreakStyle of LF+CRLF for message with only CRLF (CRLF contains LF)', () => {
    const msg = new SegmentedMessage('Hello\r\nworld');
    expect(msg.lineBreakStyle).toBe('LF+CRLF');
  });

  it('has lineBreakStyle of LF+CRLF for message with both CRLF and standalone LF', () => {
    const msg = new SegmentedMessage('Hello\r\nworld\nfoo');
    expect(msg.lineBreakStyle).toBe('LF+CRLF');
  });
});
