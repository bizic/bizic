import Bizic from './core';
import Service from './service';
import { inject } from './di';
import type {
  ServiceFactory, CombinedServiceTypeMap, ServiceName, ServiceTypeMap, Provider
} from './di';
import Exception from './exception';

export default Bizic;

export {
  Service,
  inject,
  Exception
};

export type {
  ServiceFactory, CombinedServiceTypeMap, ServiceName, ServiceTypeMap, Provider
};
