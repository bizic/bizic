/* eslint-disable max-classes-per-file */
import { strict as assert } from 'assert';
import { getProvider } from '../../../src/di/host';
import BaseProvider from '../../../src/di/provider/base';

describe('core/src/di/provider/base.ts', () => {
  it('should be ok with functional factory', () => {
    const provider = new BaseProvider(new Map([['service', () => 1]]));
    assert.equal(provider.getService('service'), 1);
  });

  it('should be ok with classical factory', () => {
    class TestService {
      id = 1;

      static create() {
        return new this();
      }
    }
    const provider = new BaseProvider(new Map([['service', TestService]]));
    assert.equal((provider.getService('service') as TestService).id, 1);
  });

  it('service should be singleton', () => {
    class TestService {
      static create() {
        return new this();
      }
    }
    const provider = new BaseProvider(new Map([['service', TestService]]));
    const service1 = provider.getService('service');
    const service2 = provider.getService('service');
    assert.equal(service1, service2);
  });

  it('meta should be ok with functional factory', () => {
    const meta = { name: 1 };

    const provider = new BaseProvider(new Map([['service', (data) => {
      assert.equal(data, meta);
      return 1;
    }]]), meta);
    provider.getService('service');
  });

  it('meta should be ok with classical factory', () => {
    const meta = { name: 1 };
    class TestService {
      static create(data: unknown) {
        assert.equal(data, meta);
        return new this();
      }
    }
    const provider = new BaseProvider(new Map([['service', TestService]]), meta);
    provider.getService('service');
  });

  it('unregistered service should be ok', () => {
    const provider = new BaseProvider(new Map());
    assert.equal(provider.getService('service'), undefined);
  });

  it('multiple service should be ok', () => {
    const provider = new BaseProvider(new Map([
      ['serviceA', () => 'A'],
      ['serviceB', () => 'B']
    ]));
    assert.equal(provider.getService('serviceA'), 'A');
    assert.equal(provider.getService('serviceB'), 'B');
  });

  it('provider context should be ok', () => {
    const provider = new BaseProvider(new Map([
      ['service', () => {
        assert.equal(provider, getProvider());
        return 'A';
      }]

    ]));
    provider.getService('service');
  });
});
