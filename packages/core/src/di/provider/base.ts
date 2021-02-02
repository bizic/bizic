import Exception from '../../exception';
import { execWithProvider } from '../host';

export type ServiceFactory<T = unknown> = ServiceClassFactory<T> | ServiceFunctionalFactory<T>;

interface ServiceClassFactory<T = unknown> {
  create(...args: unknown[]): T;
}
type ServiceFunctionalFactory<T = unknown> = (...args: unknown[]) => T;

interface Service { // eslint-disable-line @typescript-eslint/no-empty-interface

}

export interface CombinedServiceTypeMap { // eslint-disable-line @typescript-eslint/no-empty-interface
}

export type ServiceTypeMap = keyof CombinedServiceTypeMap extends never
  ? { [key: string]: Service }
  : CombinedServiceTypeMap;

export interface HookEventsMap {
  created: (key: string | symbol, instance: unknown) => void;
}
type WithoutNumber<K> = K extends number ? never : K;

export type ServiceName = WithoutNumber<keyof ServiceTypeMap>;

export interface Provider {
  getService<K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined;
}

export default class BaseProvider implements Provider {
  protected factories: Map<ServiceName, ServiceFactory>;

  protected services = new Map<ServiceName, unknown>();

  protected meta: Record<PropertyKey, unknown>;

  private instancesWillCreated: Set<ServiceName> = new Set();

  constructor(factories: Map<ServiceName, ServiceFactory>, meta: Record<PropertyKey, unknown> = {}) {
    this.factories = factories;
    this.meta = meta;
  }

  getService<K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined {
    let instance = this.services.get(key) as ServiceTypeMap[K] | undefined;
    if (instance === undefined) {
      const factory = this.factories.get(key);
      if (factory !== undefined) {
        instance = this.createInstance(key, factory);
        this.services.set(key, instance);
      }
    }
    return instance;
  }

  protected createInstance<K extends ServiceName>(key: K, factory: ServiceFactory): ServiceTypeMap[K] {
    try {
      if (this.instancesWillCreated.has(key)) {
        const dependencyRelationship = [...this.instancesWillCreated, key].join(' -> ');
        throw new Exception(`Service '${key}' has circular dependencies: ${dependencyRelationship}`);
      }
      this.instancesWillCreated.add(key);
      return execWithProvider(this,
        () => ('create' in factory ? factory.create(this.meta) : factory(this.meta)) as ServiceTypeMap[K]);
    } finally {
      this.instancesWillCreated.delete(key);
    }
  }
}
