import BaseProvider, {
  Provider, ServiceFactory, ServiceName, ServiceTypeMap
} from './base';

import type { ScopeId } from './scope';

export type SharedServiceFactoryMap = Map<ScopeId, Map<ServiceName, {
  scopes: ScopeId[];
  factory: ServiceFactory;
}>>;

export default class RootProvider extends BaseProvider {
  protected parent: RootProvider | undefined;

  protected sharedServices = new Map<ScopeId, Map<ServiceName, unknown>>();

  protected sharedFactories: SharedServiceFactoryMap;

  constructor(
    factories: Map<ServiceName, ServiceFactory>,
    sharedFactories: SharedServiceFactoryMap,
    meta: Record<PropertyKey, unknown> = {}
  ) {
    super(factories, meta);
    this.sharedFactories = sharedFactories;
  }

  getVirtualSharedProvider(scopeId: ScopeId): Provider | undefined {
    if (!this.sharedFactories.has(scopeId)) return;
    return {
      getService: <K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined => this.getSharedService(scopeId, key),
    };
  }

  protected getSharedService<K extends ServiceName>(scopeId: ScopeId, key: K): ServiceTypeMap[K] | undefined {
    let instance = this.sharedServices.get(scopeId)?.get(key) as ServiceTypeMap[K] | undefined;
    if (instance === undefined) {
      const factoryWithScopes = this.sharedFactories.get(scopeId)?.get(key);
      if (factoryWithScopes !== undefined) {
        instance = this.createInstance(factoryWithScopes.factory, this);
        factoryWithScopes.scopes.forEach((id) => this.cacheSharedService<K>(id, key, instance!)); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
    }
    return instance;
  }

  private cacheSharedService<K extends ServiceName>(scopeId: ScopeId, key: K, instance: ServiceTypeMap[K]): void {
    let services = this.sharedServices.get(scopeId);
    if (services === undefined) {
      services = new Map();
      this.sharedServices.set(scopeId, services);
    }
    services.set(key, instance);
  }
}
