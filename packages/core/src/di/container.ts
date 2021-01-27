import { ServiceFactory, ServiceName, ServiceTypeMap } from './provider/base';
import RootProvider, { SharedServiceFactoryMap } from './provider/root';
import ScopedProvider, { ScopeId } from './provider/scope';

export default class Container {
  protected serviceFactories = new Map<ServiceName, ServiceFactory>();

  protected scopedServiceFactories = new Map<ScopeId, Map<ServiceName, ServiceFactory>>();

  protected sharedServiceFactories: SharedServiceFactoryMap = new Map();

  protected option: Partial<{ meta: Record<PropertyKey, unknown> }>;

  private rootProvider: RootProvider | undefined;

  constructor(option?: { meta: Record<PropertyKey, unknown> }) {
    this.option = option || {};
  }

  registerServiceFactory<K extends ServiceName>(serviceName: K, factory: ServiceFactory<ServiceTypeMap[K]>): void {
    this.serviceFactories.set(serviceName, factory);
  }

  registerScopedServiceFactory<K extends ServiceName>(
    scopeId: string | symbol,
    serviceName: K,
    factory: ServiceFactory<ServiceTypeMap[K]>
  ): void {
    let factories = this.scopedServiceFactories.get(scopeId);
    if (factories === undefined) {
      factories = new Map<ServiceName, ServiceFactory>();
      this.scopedServiceFactories.set(scopeId, factories);
    }
    factories.set(serviceName, factory);
  }

  registerSharedServiceFactory<K extends ServiceName>(
    scopeIds: ScopeId[],
    serviceName: K,
    factory: ServiceFactory<ServiceTypeMap[K]>
  ): void {
    const factoryWithScopes = {
      scopes: scopeIds,
      factory,
    };
    scopeIds.forEach((scopeId) => {
      let factories = this.sharedServiceFactories.get(scopeId);
      if (factories === undefined) {
        factories = new Map();
        this.sharedServiceFactories.set(scopeId, factories);
      }
      factories.set(serviceName, factoryWithScopes);
    });
  }

  getRootProvider(): RootProvider {
    if (this.rootProvider === undefined) {
      this.rootProvider = new RootProvider(this.serviceFactories, this.sharedServiceFactories, this.option.meta);
    }
    return this.rootProvider;
  }

  getScopedProvider(scopedId: string | symbol, meta?: Record<PropertyKey, unknown>): ScopedProvider {
    const factories = this.scopedServiceFactories.get(scopedId) || new Map();
    const rootProvider = this.getRootProvider();
    const provider = new ScopedProvider(scopedId, rootProvider, factories, meta);
    return provider;
  }
}
