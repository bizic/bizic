import BaseProvider, {
  Provider, ServiceFactory, ServiceName, ServiceTypeMap
} from './base';

import RootProvider from './root';

export type ScopeId = string | symbol;

export default class ScopedProvider extends BaseProvider {
  protected shared: Provider | undefined;

  protected parent: Provider;

  scopeId: ScopeId;

  constructor(
    scopeId: ScopeId,
    rootProvider: RootProvider,
    factories: Map<ServiceName, ServiceFactory>,
    meta: Record<PropertyKey, unknown> = {}
  ) {
    super(factories, { scopeId, ...meta });
    this.scopeId = scopeId;
    this.parent = rootProvider;
    this.shared = rootProvider.getVirtualSharedProvider(scopeId);
  }

  getService<K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined {
    return super.getService(key)
      || this.shared?.getService(key)
      || this.parent.getService(key);
  }

  setParent(provider: Provider): void {
    this.parent = provider;
  }
}
