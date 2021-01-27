import { strict as assert } from 'assert';
import Service from '../src/service';

describe('core/src/service.ts', () => {
  it('factory should be ok', () => {
    const service = Service.create();
    assert(service instanceof Service);
  });
});
