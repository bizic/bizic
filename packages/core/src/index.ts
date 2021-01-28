import Saxony from './core';
import Service from './service';
import { inject } from './di';
import type {
  ServiceFactory, CombinedServiceTypeMap, ServiceName, ServiceTypeMap, Provider
} from './di';
import Exception from './exception';

export default Saxony;

export {
  Service,
  inject,
  Exception
};

export type {
  ServiceFactory, CombinedServiceTypeMap, ServiceName, ServiceTypeMap, Provider
};
