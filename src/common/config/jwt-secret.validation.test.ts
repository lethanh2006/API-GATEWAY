import assert from 'node:assert/strict';
import test from 'node:test';
import { requireJwtSecret } from './jwt-secret';

test('từ chối JWT secret bị thiếu hoặc quá ngắn', () => {
  assert.throws(() => requireJwtSecret(undefined), /JWT_SECRET/);
  assert.throws(() => requireJwtSecret('short-secret'), /ít nhất 32 byte/);
});

test('trả về JWT secret hợp lệ đã được chuẩn hóa', () => {
  const secret = '0123456789abcdef0123456789abcdef';

  assert.equal(requireJwtSecret(`  ${secret}  `), secret);
});
