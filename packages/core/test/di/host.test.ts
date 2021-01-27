import { strict as assert } from 'assert';
import { Provider, ServiceName, ServiceTypeMap } from '../../src/di/provider/base';
import { getProvider, execWithProvider } from '../../src/di/host';

class TestProvider implements Provider {
  getService<K extends ServiceName>(key: K): ServiceTypeMap[K] | undefined {
    throw new Error('Method not implemented.');
  }
}
describe('core/src/di/host.ts', () => {
  it('base usage should be ok', () => {
    const provider = new TestProvider();
    execWithProvider(provider, () => {
      assert.equal(provider, getProvider());
    });
    assert.equal(undefined, getProvider());
  });

  it('recursive provider should be ok', () => {
    const provider = new TestProvider();
    const subProvider = new TestProvider();
    execWithProvider(provider, () => {
      assert.equal(provider, getProvider());
      execWithProvider(subProvider, () => assert.equal(subProvider, getProvider()));
      assert.equal(provider, getProvider());
    });
  });

  it('execWithProvider should be ok when task throw an error', () => {
    const provider = new TestProvider();
    try {
      execWithProvider(provider, () => {
        throw new Error('nothing');
      });
    } catch { } // eslint-disable-line no-empty

    assert.equal(undefined, getProvider());
  });

  it('execWithProvider result should be ok ', () => {
    const provider = new TestProvider();

    assert.equal(2, execWithProvider(provider, () => 2));
  });
});
