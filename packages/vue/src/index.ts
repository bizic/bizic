import {
  withRootProvider, withScopedProvider
} from './hoc';
import {
  SAXONY_CORE_KEY, PROVIDER_KEY, RootProvider, RootProviderProps, ScopedProvider, ScopedProviderProps
} from './components';
import useService from './useService';
import {
  makeAutoObserver, makeObserver, AnnotationMap, AnnotationType
} from './reactive/observe';
import Observable from './reactive/observable';

export {
  useService,
  Observable,
  makeAutoObserver,
  makeObserver,
  RootProvider,
  ScopedProvider,
  withRootProvider,
  withScopedProvider,
  PROVIDER_KEY,
  SAXONY_CORE_KEY,
  AnnotationType
};
export type {
  AnnotationMap,
  RootProviderProps,
  ScopedProviderProps
};
