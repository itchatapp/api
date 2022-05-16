import * as is from './is.ts';
import { assert, assertFalse } from 'assert';
import { Snowflake } from '@utils';

Deno.test('is#nil', () => {
  assert(is.nil(undefined));
  assert(is.nil(null));
  assertFalse(is.nil(''));
  assertFalse(is.nil({}));
  assertFalse(is.nil([]));
  assertFalse(is.nil(NaN));
  assertFalse(is.nil(1));
});

Deno.test('is#object', () => {
  assert(is.object({}));
  assert(is.object({ test: true }));
  assertFalse(is.object([]));
  assertFalse(is.object(null));
});

Deno.test('is#email', () => {
  assert(is.email('test@example.com'));
  assert(is.email('test.1231@example.com'));
  assert(is.email('test-1231@example.com'));
  assertFalse(is.email('random-string'));
  assertFalse(is.email('hi@test'));
});

Deno.test('is#empty', () => {
  assert(is.empty([]));
  assert(is.empty({}));
  assert(is.empty(undefined));
  assert(is.empty(null));
  assertFalse(is.empty([1]));
  assertFalse(is.empty({ test: true }));
});

Deno.test('is#snowflake', () => {
  assert(is.snowflake(Snowflake.generate()));
  assert(is.snowflake(Snowflake.generate().toString()));
  assertFalse(is.snowflake(''));
  assertFalse(is.snowflake(123));
  assertFalse(is.snowflake(312n));
  assertFalse(is.snowflake(NaN));
});
