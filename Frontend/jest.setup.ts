import '@testing-library/jest-dom';

// Polyfill TextEncoder and TextDecoder which are missing in JSDOM
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
