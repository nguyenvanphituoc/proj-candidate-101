import { z } from 'zod';

/**
 * Raw API shapes for the auth module (TECH_SPEC §4 data layer). DTO schemas
 * are deliberately tolerant — only the fields the app consumes are declared,
 * unknown fields pass through (`looseObject`), and absent/null fields
 * (`nullish`) default in the mapper. Domain never sees these shapes;
 * `authMapper` converts them.
 */

/** POST {AUTH_BASE_URL}/token — OAuth2 password grant (Appendix A). */
export const TokenResponseDtoSchema = z.looseObject({
  access_token: z.string().min(1),
  expires_in: z.number(),
});
export type TokenResponseDto = z.infer<typeof TokenResponseDtoSchema>;

const MembershipDtoSchema = z.looseObject({
  organisationId: z.string().nullish(),
  organisationName: z.string().nullish(),
  /** The org token required by invoice-service calls. */
  token: z.string().nullish(),
});
export type MembershipDto = z.infer<typeof MembershipDtoSchema>;

const UserProfileDtoSchema = z.looseObject({
  userId: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  memberships: z.array(MembershipDtoSchema).nullish(),
});
export type UserProfileDto = z.infer<typeof UserProfileDtoSchema>;

/**
 * GET /membership-service/1.0.0/users/me — accepts both the enveloped
 * (`{ data: {...} }`) and bare shapes; the exact envelope is an open item
 * (TECH_SPEC §6), so the DTO tolerates either and unwraps to the bare
 * profile on parse.
 */
export const GetMeResponseDtoSchema = z.union([
  z.looseObject({ data: UserProfileDtoSchema }).transform(env => env.data),
  UserProfileDtoSchema,
]);
export type GetMeResponseDto = z.infer<typeof GetMeResponseDtoSchema>;
