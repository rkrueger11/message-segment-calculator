const { SegmentedMessage } = require('../dist');

// GSM-7 multi-segment: 153 chars per segment (1120 - 48 UDH bits = 1072 bits / 7 = 153.14 → 153)
// UCS-2 multi-segment: 67 chars per segment (1072 bits / 16 = 67)
// UDH: 48 bits (6 octets) per segment in concatenated messages
// totalSize = messageSize + (segmentsCount × 48)

describe('Long GSM-7 messages - 4 segments', () => {
  // 460 chars: 3 × 153 = 459 fills 3 segments, +1 char overflows into segment 4
  const testMessage = '1'.repeat(460);
  const segmentedMessage = new SegmentedMessage(testMessage);

  test('has 4 segments', () => {
    expect(segmentedMessage.segmentsCount).toBe(4);
  });

  test('all 4 segments have User Data Header at indices 0-5', () => {
    for (let segmentIndex = 0; segmentIndex < 4; segmentIndex++) {
      for (let index = 0; index < 6; index++) {
        expect(segmentedMessage.segments[segmentIndex][index].isUserDataHeader).toBe(true);
      }
    }
  });

  test('totalSize equals messageSize + 4 × 48', () => {
    expect(segmentedMessage.totalSize).toBe(segmentedMessage.messageSize + 4 * 48);
  });

  test('messageSize is 3220 bits (460 chars × 7 bits)', () => {
    expect(segmentedMessage.messageSize).toBe(3220);
  });

  test('totalSize is 3412 bits', () => {
    expect(segmentedMessage.totalSize).toBe(3412);
  });

  test('last segment has 7 entries (6 UDH + 1 char)', () => {
    expect(segmentedMessage.segments[3].length).toBe(7);
  });

  test("last segment's only character is '1'", () => {
    expect(segmentedMessage.segments[3][6].raw).toBe('1');
  });
});

describe('Long GSM-7 messages - exactly 4 full segments (612 chars)', () => {
  // 4 × 153 = 612 exactly fills 4 segments
  const testMessage = '1'.repeat(4 * 153);
  const segmentedMessage = new SegmentedMessage(testMessage);

  test('has 4 segments', () => {
    expect(segmentedMessage.segmentsCount).toBe(4);
  });

  test('all 4 segments have User Data Header at indices 0-5', () => {
    for (let segmentIndex = 0; segmentIndex < 4; segmentIndex++) {
      for (let index = 0; index < 6; index++) {
        expect(segmentedMessage.segments[segmentIndex][index].isUserDataHeader).toBe(true);
      }
    }
  });

  test('totalSize equals messageSize + 4 × 48', () => {
    expect(segmentedMessage.totalSize).toBe(segmentedMessage.messageSize + 4 * 48);
  });

  test('messageSize is 4284 bits (612 chars × 7 bits)', () => {
    expect(segmentedMessage.messageSize).toBe(4284);
  });

  test('totalSize is 4476 bits', () => {
    expect(segmentedMessage.totalSize).toBe(4476);
  });
});

describe('Long GSM-7 messages - 5 segments (613 chars)', () => {
  // 4 × 153 + 1 = 613 chars overflows into a 5th segment
  const testMessage = '1'.repeat(4 * 153 + 1);
  const segmentedMessage = new SegmentedMessage(testMessage);

  test('has 5 segments', () => {
    expect(segmentedMessage.segmentsCount).toBe(5);
  });

  test('all 5 segments have User Data Header at indices 0-5', () => {
    for (let segmentIndex = 0; segmentIndex < 5; segmentIndex++) {
      for (let index = 0; index < 6; index++) {
        expect(segmentedMessage.segments[segmentIndex][index].isUserDataHeader).toBe(true);
      }
    }
  });

  test('totalSize equals messageSize + 5 × 48', () => {
    expect(segmentedMessage.totalSize).toBe(segmentedMessage.messageSize + 5 * 48);
  });

  test('messageSize is 4291 bits (613 chars × 7 bits)', () => {
    expect(segmentedMessage.messageSize).toBe(4291);
  });

  test('totalSize is 4531 bits', () => {
    expect(segmentedMessage.totalSize).toBe(4531);
  });

  test('last segment has 7 entries (6 UDH + 1 char)', () => {
    expect(segmentedMessage.segments[4].length).toBe(7);
  });
});

describe('Long UCS-2 messages - 4 segments (202 chars)', () => {
  // 202 = 3 × 67 + 1, so 4 segments
  const testMessage = 'Á'.repeat(202);
  const segmentedMessage = new SegmentedMessage(testMessage);

  test('has 4 segments', () => {
    expect(segmentedMessage.segmentsCount).toBe(4);
  });

  test('all 4 segments have User Data Header at indices 0-5', () => {
    for (let segmentIndex = 0; segmentIndex < 4; segmentIndex++) {
      for (let index = 0; index < 6; index++) {
        expect(segmentedMessage.segments[segmentIndex][index].isUserDataHeader).toBe(true);
      }
    }
  });

  test('totalSize equals messageSize + 4 × 48', () => {
    expect(segmentedMessage.totalSize).toBe(segmentedMessage.messageSize + 4 * 48);
  });

  test('messageSize is 3232 bits (202 chars × 16 bits)', () => {
    expect(segmentedMessage.messageSize).toBe(3232);
  });

  test('totalSize is 3424 bits', () => {
    expect(segmentedMessage.totalSize).toBe(3424);
  });

  test('last segment has 7 entries (6 UDH + 1 char)', () => {
    expect(segmentedMessage.segments[3].length).toBe(7);
  });

  test("last segment's only character is 'Á'", () => {
    expect(segmentedMessage.segments[3][6].raw).toBe('Á');
  });
});

describe('Long UCS-2 messages - 5 segments (269 chars)', () => {
  // 4 × 67 + 1 = 269 chars, overflows into a 5th segment
  const testMessage = 'Á'.repeat(4 * 67 + 1);
  const segmentedMessage = new SegmentedMessage(testMessage);

  test('has 5 segments', () => {
    expect(segmentedMessage.segmentsCount).toBe(5);
  });

  test('all 5 segments have User Data Header at indices 0-5', () => {
    for (let segmentIndex = 0; segmentIndex < 5; segmentIndex++) {
      for (let index = 0; index < 6; index++) {
        expect(segmentedMessage.segments[segmentIndex][index].isUserDataHeader).toBe(true);
      }
    }
  });

  test('totalSize equals messageSize + 5 × 48', () => {
    expect(segmentedMessage.totalSize).toBe(segmentedMessage.messageSize + 5 * 48);
  });

  test('messageSize is 4304 bits (269 chars × 16 bits)', () => {
    expect(segmentedMessage.messageSize).toBe(4304);
  });

  test('totalSize is 4544 bits', () => {
    expect(segmentedMessage.totalSize).toBe(4544);
  });

  test('last segment has 7 entries (6 UDH + 1 char)', () => {
    expect(segmentedMessage.segments[4].length).toBe(7);
  });
});

describe('totalSize = messageSize + segmentsCount × 48 invariant', () => {
  const cases = [
    ['GSM-7 161 chars', '1'.repeat(161), 2, 1127, 1223],
    ['GSM-7 306 chars', '1'.repeat(306), 2, 2142, 2238],
    ['GSM-7 307 chars', '1'.repeat(307), 3, 2149, 2293],
    ['GSM-7 460 chars', '1'.repeat(460), 4, 3220, 3412],
    ['GSM-7 613 chars', '1'.repeat(613), 5, 4291, 4531],
    ['UCS-2 71 chars',  'Á'.repeat(71),  2, 1136, 1232],
    ['UCS-2 134 chars', 'Á'.repeat(134), 2, 2144, 2240],
    ['UCS-2 135 chars', 'Á'.repeat(135), 3, 2160, 2304],
    ['UCS-2 202 chars', 'Á'.repeat(202), 4, 3232, 3424],
    ['UCS-2 269 chars', 'Á'.repeat(269), 5, 4304, 4544],
  ];

  test.each(cases)(
    '%s: totalSize === messageSize + segmentsCount × 48',
    (label, msg, expectedSegments, expectedMessageSize, expectedTotalSize) => {
      const sm = new SegmentedMessage(msg);
      expect(sm.segmentsCount).toBe(expectedSegments);
      expect(sm.messageSize).toBe(expectedMessageSize);
      expect(sm.totalSize).toBe(expectedTotalSize);
      expect(sm.totalSize).toBe(sm.messageSize + sm.segmentsCount * 48);
    }
  );
});
