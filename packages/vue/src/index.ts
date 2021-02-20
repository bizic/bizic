import {
  withRootProvider, withScopedProvider
} from './hoc';
import {
  BIZIC_KEY, PROVIDER_KEY, RootProvider, RootProviderProps, ScopedProvider, ScopedProviderProps
} from './components';
import useService from './useService';

export {
  useService,
  RootProvider,
  ScopedProvider,
  withRootProvider,
  withScopedProvider,
  PROVIDER_KEY,
  BIZIC_KEY
};
export type {
  RootProviderProps,
  ScopedProviderProps
};
