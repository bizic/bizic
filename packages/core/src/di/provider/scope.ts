import BaseProvider, {
  Provider, ServiceFactory, ServiceName, ServiceTypeMap
} from './base';

import RootProvider from './root';

export type ScopeId = string | symbol;

export default class ScopedProvider extends BaseProvider {
  protected shared: Provider | undefined;

  protected parent: RootProvider | ScopedProvider;

  scopeId: ScopeId;

  constructor(
    scopeId: ScopeId,
    parentProvider: RootProvider | ScopedProvider,
    factories: Map<ServiceName, ServiceFactory>,
    meta: Record<PropertyKey, unknown> = {}
  ) {
    super(factories, { scopeId, ...meta });
    this.scopeId = scopeId;
    this.parent = parentProvider;
    this.shared = this.getRootProvider().getVirtualSharedProvider(scopeId);
  }

  getService<K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined {
    return super.getService(key)
      || this.shared?.getService(key)
      || this.parent.getService(key);
  }

  getRootProvider(): RootProvider {
    const provider = this.parent;

    if (provider instanceof RootProvider) { return provider; }

    return provider.getRootProvider();
  }
}
