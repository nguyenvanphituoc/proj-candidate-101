import type { TokenGrant } from '../domain/repositories/IAuthRepository';
import type { User } from '../domain/schemas';
import type {
  GetMeResponseDto,
  MembershipDto,
  TokenResponseDto,
} from './authDtos';

/** DTO → domain mapping (TECH_SPEC §4 data layer) — raw shapes stop here. */

export function mapTokenGrant(dto: TokenResponseDto): TokenGrant {
  return {
    accessToken: dto.access_token,
    expiresInSec: dto.expires_in,
  };
}

export function mapUser(profile: GetMeResponseDto): User {
  return {
    userId: profile.userId,
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    // memberships without a token are useless downstream (org token is
    // mandatory for invoice-service) — drop them here so the login use case's
    // memberships[0] pick is always usable
    memberships: (profile.memberships ?? [])
      .filter(
        (membership): membership is MembershipDto & { token: string } =>
          Boolean(membership.token),
      )
      .map(membership => ({
        organisationId: membership.organisationId ?? '',
        organisationName:
          membership.organisationName ?? membership.organisationId ?? '',
        token: membership.token,
      })),
  };
}
