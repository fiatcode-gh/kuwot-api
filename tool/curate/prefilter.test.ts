import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeText,
  hasAuthor,
  isValidLength,
  dedupeKey,
  prefilter,
  type RawQuote,
} from './prefilter.ts';

test('normalizeText trims and collapses whitespace', () => {
  assert.equal(normalizeText('  a   b\n c  '), 'a b c');
  assert.equal(normalizeText('\thello\t'), 'hello');
});

test('hasAuthor rejects empty/whitespace', () => {
  assert.equal(hasAuthor('Mark Twain'), true);
  assert.equal(hasAuthor(''), false);
  assert.equal(hasAuthor('   '), false);
});

test('isValidLength enforces bounds', () => {
  assert.equal(isValidLength('x'.repeat(19)), false);
  assert.equal(isValidLength('x'.repeat(20)), true);
  assert.equal(isValidLength('x'.repeat(150)), true);
  assert.equal(isValidLength('x'.repeat(151)), false);
});

test('dedupeKey is case- and whitespace-insensitive', () => {
  assert.equal(dedupeKey('Hello  World'), dedupeKey('hello world'));
});

test('prefilter cleans, drops invalid, dedups, and caps per author', () => {
  const rows: RawQuote[] = [
    {
      quote: '  A wonderful quote that is long enough to keep.  ',
      author: 'Alice',
    },
    {
      quote: 'A WONDERFUL QUOTE THAT IS LONG ENOUGH TO KEEP.',
      author: 'Alice',
    }, // dup
    { quote: 'too short', author: 'Bob' }, // < 20 chars
    {
      quote: 'A perfectly fine second quote from Alice here.',
      author: 'Alice',
    },
    { quote: 'A valid quote but the author field is empty here.', author: '' }, // no author
  ];
  const out = prefilter(rows, { perAuthorCap: 1 });
  assert.deepEqual(out, [
    { q: 'A wonderful quote that is long enough to keep.', a: 'Alice' },
  ]);
});
