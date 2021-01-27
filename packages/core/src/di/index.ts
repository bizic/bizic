import inject from './inject';

import Container from './container';
import {
  Provider,
  CombinedServiceTypeMap,
  ServiceTypeMap,
  ServiceFactory,
  ServiceName
} from './provider/base';

export default Container;

export {
  inject,
  Provider,
  CombinedServiceTypeMap,
  ServiceTypeMap,
  ServiceFactory,
  ServiceName
};
