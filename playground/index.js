const { SegmentedMessage } = require('../dist');

// Simple ANSI color codes (no external dependency needed)
const colors = {
  reset: '\x1b[0m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  grey: '\x1b[90m',
};

const encodingColors = {
  'GSM-7': (text) => `${colors.green}${text}${colors.reset}`,
  'UCS-2': (text) => `${colors.yellow}${text}${colors.reset}`,
  UDH: (text) => `${colors.grey}${text}${colors.reset}`,
};

if (!process.argv[2]) {
  console.log(`
    Usage: 
    node index.js "<body of the message>"

    Example: 
    node index.js "👋 Hello World 🌍"
    `);
  return;
}

const message = process.argv[2];
const segmentedMessage = new SegmentedMessage(message);

function serializeSegment(segment) {
  let result = [];
  segment.forEach((char) => {
    if (char.codeUnits) {
      char.codeUnits.forEach((codeUnit) => {
        result.push({
          value: `0x${codeUnit.toString(16)}`,
          type: char.isGSM7 ? 'GSM-7' : 'UCS-2',
        });
      });
    } else {
      result.push({ value: 'UDH', type: 'UDH' });
    }
  });
  return result;
}

console.log(`
Encoding: ${colors.magenta}${segmentedMessage.encodingName}${colors.reset}
Number of Segment: ${colors.magenta}${segmentedMessage.segmentsCount}${colors.reset}
Message Size: ${colors.magenta}${segmentedMessage.messageSize}${colors.reset}
Total Size: ${colors.magenta}${segmentedMessage.totalSize}${colors.reset}
Number of Unicode Scalars: ${colors.magenta}${segmentedMessage.numberOfUnicodeScalars}${colors.reset}
Number of Characters: ${colors.magenta}${segmentedMessage.numberOfCharacters}${colors.reset}

${colors.blue}Segments encoding${colors.reset}`);

segmentedMessage.segments.forEach((segment, index) => {
  console.log(`${colors.cyan}\nSegment ${index + 1}\n${colors.reset}`);
  let serializedSegment = serializeSegment(segment);
  let byteIndex = 0;
  while (byteIndex < serializedSegment.length) {
    let byteRow = `${byteIndex}\t`;
    for (let col = 0; col < 10; col++) {
      let byte = serializedSegment[byteIndex];
      if (byte) {
        byteRow += `${encodingColors[byte.type](byte.value)}\t`;
      }
      byteIndex += 1;
    }
    console.log(byteRow);
  }
});

console.log(`\n`);
