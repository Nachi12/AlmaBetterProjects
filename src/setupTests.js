import '@testing-library/jest-dom';
require('whatwg-fetch');
const { TextEncoder, TextDecoder } = require('text-encoding');
const { TransformStream } = require('web-streams-polyfill');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.TransformStream = TransformStream;