/* eslint-disable max-classes-per-file */
import { strict as assert } from 'assert';
import { getProvider } from '../../../src/di/host';
import RootProvider, { SharedServiceFactoryMap } from '../../../src/di/provider/root';

describe('core/src/di/provider/root.ts', () => {
  it('shared provider should be ok ', () => {
    const factories = new Map();
    const sharedFactories: SharedServiceFactoryMap = new Map([['scopeA', new Map([[
      'test', {
        scopes: ['scopeA'],
        factory: () => 1,
      }
    ]])]]);
    const provider = new RootProvider(factories, sharedFactories);
    const sharedProvider = provider.getVirtualSharedProvider('scopeA');
    assert(sharedProvider);
    assert.equal(sharedProvider.getService('test'), 1);
  });

  it('get shared provider should be ok whit empty shared factories', () => {
    const factories = new Map();
    const sharedFactories = new Map();
    const provider = new RootProvider(factories, sharedFactories);
    const sharedProvider = provider.getVirtualSharedProvider('scopeA');
    assert.equal(sharedProvider, undefined);
  });

  it('multiple shared provider should be ok ', () => {
    const factories = new Map();
    const factoryWithScopes = {
      scopes: ['scopeA', 'scopeB'],
      factory: () => ({}),
    };
    const sharedFactories: SharedServiceFactoryMap = new Map([
      ['scopeA', new Map([
        ['test', factoryWithScopes],
        ['onlyScopedA', { scopes: ['scopeA'], factory: () => 1 }]
      ])],
      ['scopeB', new Map([['test', factoryWithScopes]])]
    ]);
    const provider = new RootProvider(factories, sharedFactories);
    const sharedProviderA = provider.getVirtualSharedProvider('scopeA');
    assert(sharedProviderA);
    const sharedProviderB = provider.getVirtualSharedProvider('scopeB');
    assert(sharedProviderB);
    assert.equal(sharedProviderA.getService('test'), sharedProviderB.getService('test'));
    assert.equal(sharedProviderA.getService('onlyScopedA'), 1);
    assert.equal(sharedProviderB.getService('onlyScopedA'), undefined);
  });
});
