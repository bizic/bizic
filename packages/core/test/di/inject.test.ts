import { strict as assert } from 'assert';
import { execWithProvider } from '../../src/di/host';
import inject from '../../src/di/inject';
import BaseProvider from '../../src/di/provider/base';

describe('core/src/di/host.ts', () => {
  it('inject should be ok', () => {
    const provider = new BaseProvider(new Map([['test', () => 1]]));
    execWithProvider(provider, () => {
      // provider.register('test', () => 1);
      assert.equal(1, inject('test'));
    });
  });

  it('inject should throw an error when not in injection context', () => {
    assert.throws(() => inject('test'), { message: 'Function \'inject()\' must be called in an injection context' });
  });
  it('inject should throw an error when provider not fount', () => {
    const provider = new BaseProvider(new Map());
    execWithProvider(provider, () => {
      assert.throws(() => inject('test'), { message: 'Service named \'test\' is not registered' });
    });
  });
});
