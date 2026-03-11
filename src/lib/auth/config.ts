/**
 * Single-user credentials. Validation is local only.
 * Not for use in multi-user or public deployments.
 */
export const AUTH_CREDENTIALS = {
  username: 'ygbarakat@gmail.com',
  password: 'tool7060',
} as const;

export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
