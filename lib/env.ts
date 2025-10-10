/**
 * Environment Variable Validation
 *
 * Validates required environment variables at startup to fail fast
 * with clear error messages. Uses Zod for type-safe validation.
 *
 * Usage:
 *   import { env } from '@/lib/env';
 *   console.log(env.ADMIN_PASSWORD); // TypeScript autocomplete!
 */

import { z } from 'zod';

const envSchema = z.object({
  // Admin Panel Authentication
  ADMIN_PASSWORD: z
    .string()
    .min(8, 'Admin password must be at least 8 characters for security')
    .describe('Password for admin panel authentication'),

  // OpenRouter AI API Configuration
  OPENROUTER_KEY: z
    .string()
    .min(1, 'OpenRouter API key is required for AI features')
    .startsWith('sk-or-', 'OpenRouter key must start with sk-or-')
    .describe('API key from https://openrouter.ai/keys'),

  OPENROUTER_MODEL: z
    .string()
    .default('openai/gpt-4.1-nano')
    .describe('AI model to use for content enhancement'),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
    .describe('Current environment'),
});

/**
 * Validated environment variables with type safety
 *
 * @throws {z.ZodError} If required environment variables are missing or invalid
 */
export const env = (() => {
  try {
    return envSchema.parse({
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      OPENROUTER_KEY: process.env.OPENROUTER_KEY,
      OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment variable validation failed:\n');
      error.errors.forEach((err) => {
        console.error(`  • ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n💡 Check your .env file and ensure all required variables are set.\n');
    }
    throw error;
  }
})();

/**
 * Type-safe environment variables
 * Export type for use in other files without importing env object
 */
export type Env = z.infer<typeof envSchema>;
