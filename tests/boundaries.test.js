const { SegmentedMessage } = require('../dist');

const BoundaryTestData = [
  {
    testDescription: 'GSM-7 exactly fills 2 segments (306 chars = 2 × 153)',
    body: '1'.repeat(306),
    encoding: 'GSM-7',
    segments: 2,
    messageSize: 2142,
    totalSize: 2238,
    characters: 306,
    unicodeScalars: 306,
  },
  {
    testDescription: 'GSM-7 exactly fills 3 segments (459 chars = 3 × 153)',
    body: '1'.repeat(459),
    encoding: 'GSM-7',
    segments: 3,
    messageSize: 3213,
    totalSize: 3357,
    characters: 459,
    unicodeScalars: 459,
  },
  {
    testDescription: 'GSM-7 first 4-segment message (460 chars)',
    body: '1'.repeat(460),
    encoding: 'GSM-7',
    segments: 4,
    messageSize: 3220,
    totalSize: 3412,
    characters: 460,
    unicodeScalars: 460,
  },
  {
    testDescription: 'UCS-2 exactly fills 2 segments (134 Á chars = 2 × 67)',
    body: 'Á'.repeat(134),
    encoding: 'UCS-2',
    segments: 2,
    messageSize: 2144,
    totalSize: 2240,
    characters: 134,
    unicodeScalars: 134,
  },
  {
    testDescription: 'UCS-2 first 3-segment message (135 Á chars)',
    body: 'Á'.repeat(135),
    encoding: 'UCS-2',
    segments: 3,
    messageSize: 2160,
    totalSize: 2304,
    characters: 135,
    unicodeScalars: 135,
  },
  {
    testDescription: 'UCS-2 exactly fills 3 segments (201 Á chars = 3 × 67)',
    body: 'Á'.repeat(201),
    encoding: 'UCS-2',
    segments: 3,
    messageSize: 3216,
    totalSize: 3360,
    characters: 201,
    unicodeScalars: 201,
  },
  {
    testDescription: 'UCS-2 first 4-segment message (202 Á chars)',
    body: 'Á'.repeat(202),
    encoding: 'UCS-2',
    segments: 4,
    messageSize: 3232,
    totalSize: 3424,
    characters: 202,
    unicodeScalars: 202,
  },
];

describe('Exact segment boundary conditions', () => {
  BoundaryTestData.forEach((testCase) => {
    test(testCase.testDescription, () => {
      const sm = new SegmentedMessage(testCase.body);
      expect(sm.encodingName).toBe(testCase.encoding);
      expect(sm.segmentsCount).toBe(testCase.segments);
      expect(sm.messageSize).toBe(testCase.messageSize);
      expect(sm.totalSize).toBe(testCase.totalSize);
      expect(sm.numberOfCharacters).toBe(testCase.characters);
      expect(sm.numberOfUnicodeScalars).toBe(testCase.unicodeScalars);
    });
  });
});
