import {
  apiHttpClient,
  authHttpClient,
} from '@core/network';
import { secureStorage } from '@core/storage/secureStorage';

import type { IAuthRepository } from '../domain/repositories/IAuthRepository';
import { makeGetMyProfileUseCase } from '../domain/usecases/getMyProfile';
import { makeLoginUseCase } from '../domain/usecases/login';
import { makeLogoutUseCase } from '../domain/usecases/logout';
import { makeRestoreSessionUseCase } from '../domain/usecases/restoreSession';
import { AuthRepositoryImpl } from './AuthRepositoryImpl';
// import { AuthRepositoryMock } from './AuthRepositoryMock';

// Wired at import until app/di.ts lands (TECH_SPEC §4). Real sandbox repo
// when .env carries the base URLs; mock keeps a fresh checkout demoable
// (demo / demo123) without credentials.
const repository: IAuthRepository = new AuthRepositoryImpl(secureStorage, authHttpClient, apiHttpClient)
// const repository: IAuthRepository = new AuthRepositoryMock(secureStorage);

export const getMyProfile = makeGetMyProfileUseCase(repository);
export const login = makeLoginUseCase(repository, getMyProfile);
export const restoreSession = makeRestoreSessionUseCase(repository);
export const logout = makeLogoutUseCase(repository);
