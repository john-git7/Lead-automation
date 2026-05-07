import { describe, it, expect } from 'vitest';
import { leadSchema } from '../lib/validations';

describe('Lead Validation', () => {
  it('validates a correct lead', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      source: 'google',
    };
    const result = leadSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('fails on invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      phone: '1234567890',
      source: 'google',
    };
    const result = leadSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('fails on missing name', () => {
    const invalidData = {
      email: 'john@example.com',
      phone: '1234567890',
      source: 'google',
    };
    const result = leadSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
