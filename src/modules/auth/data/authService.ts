import { secureStorage } from '@core/storage/secureStorage';

import { makeGetMyProfileUseCase } from '../domain/usecases/getMyProfile';
import { makeLoginUseCase } from '../domain/usecases/login';
import { makeLogoutUseCase } from '../domain/usecases/logout';
import { makeRestoreSessionUseCase } from '../domain/usecases/restoreSession';
import { AuthRepositoryMock } from './AuthRepositoryMock';

// Wired at import until app/di.ts lands (TECH_SPEC §4) — the only lines that
// change when AuthRepositoryImpl replaces the mock.
const repository = new AuthRepositoryMock(secureStorage);

export const getMyProfile = makeGetMyProfileUseCase(repository);
export const login = makeLoginUseCase(repository, getMyProfile);
export const restoreSession = makeRestoreSessionUseCase(repository);
export const logout = makeLogoutUseCase(repository);
