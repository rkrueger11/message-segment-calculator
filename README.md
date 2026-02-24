# SMS Segment Calculator

This repo contains a package for an SMS segments calculator. The package is released as a nodeJS package as well as a browser script.
A browser demo for this package can be accessed [here](https://twiliodeved.github.io/message-segment-calculator/)

## Features

- Calculate SMS segments for GSM-7 and UCS-2 encoding
- Automatic encoding detection
- Support for Twilio's Smart Encoding
- Detect non-GSM characters in messages
- Handle extended graphemes and emoji correctly
- Line break style detection (LF, CRLF, mixed)
- TypeScript support with full type definitions
- Works in Node.js and browser environments

## Installation

```shell
npm install --save sms-segments-calculator
```

## Usage 

### Node.js

Basic usage:

```javascript
const { SegmentedMessage } = require('sms-segments-calculator');

const segmentedMessage = new SegmentedMessage('Hello World');

console.log(segmentedMessage.encodingName); // "GSM-7"
console.log(segmentedMessage.segmentsCount); // 1
```

With encoding and Smart Encoding options:

```javascript
// Force UCS-2 encoding
const message1 = new SegmentedMessage('Hello', 'UCS-2');

// Use Smart Encoding (converts certain Unicode characters to GSM-7 equivalents)
const message2 = new SegmentedMessage('Hello™', 'auto', true);

// Get non-GSM characters
const message3 = new SegmentedMessage('Hello 😊');
console.log(message3.getNonGsmCharacters()); // ['😊']
```

### Browser

You can add the library to your page using the CDN file: 

```html
<script src="https://cdn.jsdelivr.net/gh/TwilioDevEd/message-segment-calculator/docs/scripts/segmentsCalculator.js" integrity="sha256-wXuHVlXNhEWNzRKozzB87Qyi9/3p6LKskjDXFHIMInw=" crossorigin="anonymous"></script>
```

Alternatively you can add the library to your page using the file [`segmentsCalculator.js`](https://github.com/TwilioDevEd/message-segment-calculator/blob/main/docs/scripts/segmentsCalculator.js) provided in `docs/scripts/` and adding it to your page: 

```html
<script type="text/javascript" src="scripts/segmentsCalculator.js"></script>
```

And example of usage can be find in [`docs/index.html`](https://github.com/TwilioDevEd/message-segment-calculator/blob/main/docs/index.html)

## Documentation
### `SegmentedMessage` class

This is the main class exposed by the package

#### [`constructor(message, encoding, smartEncoding)`](https://github.com/TwilioDevEd/message-segment-calculator/blob/main/src/libs/SegmentedMessage.ts#L48)

Arguments:
* `message` (string): Body of the SMS message
* `encoding` (string, optional): Encoding type. Can be `GSM-7`, `UCS-2`, or `auto`. Default: `auto`
* `smartEncoding` (boolean, optional): Enable [Twilio Smart Encoding](https://www.twilio.com/docs/messaging/services#smart-encoding) emulation. Default: `false`

#### Properties

##### `encodingName`

Returns the name of the calculated encoding for the message: `GSM-7` or `UCS-2`

##### `totalSize`

Total size of the message in bits (including User Data Header if present)

##### `messageSize`

Total size of the message in bits (excluding User Data Header if present)

##### `segmentsCount`

Number of segment(s) the message is split into

##### `numberOfCharacters`

Number of characters in the message. GSM-7 extension characters count as 2.

##### `numberOfUnicodeScalars`

Number of Unicode scalar values in the message

##### `graphemes`

Array of graphemes (user-perceived characters) the message is split into

##### `segments`

Array of segment objects representing each SMS segment

##### `lineBreakStyle`

Detected line break style: `'LF'`, `'CRLF'`, `'LF+CRLF'`, or `undefined`

##### `warnings`

Array of warning messages about the message content

#### Methods

##### `getNonGsmCharacters()`

Returns an array of non-GSM-7 characters in the message body. Useful for identifying characters that force UCS-2 encoding and could be replaced to reduce segments.

##### `getEncodingName()`

Returns the encoding name for the message (`'GSM-7'` or `'UCS-2'`) 

## Try the library

If you want to test the library you can use the script provided in `playground/index.js`. Install the dependencies (`npm install`) and then run: 

```shell
$ node playground/index.js "👋 Hello World 🌍"
```

## Contributing

This code is open source and welcomes contributions. All contributions are subject to our [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md).

The source code for the library is all contained in the `src` folder. Before submitting a PR: 

* Run linter using `npm run lint` command and make sure there are no linter error
* Compile the code using `npm run build` command and make sure there are no errors
* Execute the test using `npm test` and make sure all tests pass
* Transpile the code using `npm run webpack` and test the web page in `docs/index.html`

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.

[twilio]: https://www.twilio.com
