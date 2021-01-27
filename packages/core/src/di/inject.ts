import Exception from '../exception';
import { getProvider } from './host';
import { ServiceName, ServiceTypeMap } from './provider/base';

function inject<T extends ServiceName>(key: T): ServiceTypeMap[T];
function inject<T>(key: string | symbol): T;
function inject<T extends ServiceName>(key: T): ServiceTypeMap[T] {
  const provider = getProvider();
  if (provider === undefined) {
    throw new Exception('Function \'inject()\' must be called in an injection context');
  }
  const service = provider.getService(key);
  if (service === undefined) { throw new Exception(`Service named '${key.toString()}' is not registered`); }
  return service;
}
export default inject;
