import { inject } from 'vue';
import {
  Provider, ServiceTypeMap, ServiceName, Exception
} from 'bizic';
import { PROVIDER_KEY } from './components';

function useService<T extends ServiceName>(key: T): ServiceTypeMap[T];
function useService<T>(key: string | symbol): T;
function useService<T extends ServiceName>(key: T): ServiceTypeMap[T] {
  const provider = inject<Provider>(PROVIDER_KEY);
  if (provider === undefined) throw new Exception('No provider found');
  const service = provider.getService(key);
  if (service === undefined) { throw new Exception(`Service named '${key.toString()}' is not registered`); }
  return service;
}

export default useService;
