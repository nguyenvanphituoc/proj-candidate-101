import { z } from 'zod';

/**
 * Auth domain — session, user, membership (docs/domain.md: AuthSession, User,
 * Membership). Domain rule: no React Native / fetch / TanStack imports here.
 */

/** UC-01 precondition: password min length, checked client-side. */
export const PASSWORD_MIN_LENGTH = 6;

export const MembershipSchema = z.object({
  organisationId: z.string(),
  organisationName: z.string(),
  token: z.string(),
});
export type Membership = z.infer<typeof MembershipSchema>;

export const UserSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  memberships: z.array(MembershipSchema),
});
export type User = z.infer<typeof UserSchema>;

/**
 * Stored as one atomic unit — never an access token without an org token
 * (UC-01 rule: session is all-or-nothing).
 */
export const AuthSessionSchema = z.object({
  accessToken: z.string().min(1),
  orgToken: z.string().min(1),
  /** Epoch millis — expiry check is local, no network needed (UC-03). */
  expiresAt: z.number(),
});
export type AuthSession = z.infer<typeof AuthSessionSchema>;
