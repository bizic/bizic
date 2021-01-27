import type { Provider } from './provider/base';

const PROVIDERS_HOST: Provider[] = [];

export function execWithProvider<T extends () => unknown>(provider: Provider, task: T): ReturnType<T> {
  PROVIDERS_HOST.push(provider);
  try {
    return task() as ReturnType<T>;
  } finally {
    PROVIDERS_HOST.pop();
  }
}

export function getProvider(): Provider | undefined {
  return PROVIDERS_HOST[PROVIDERS_HOST.length - 1];
}
