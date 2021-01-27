import { strict as assert } from 'assert';
import ScopeProvider from '../../../src/di/provider/scope';
import RootProvider, { SharedServiceFactoryMap } from '../../../src/di/provider/root';

describe('core/src/di/provider/scope.ts', () => {
  it('constructor should be ok', (done) => {
    const meta = { name: 1 };
    const scopeId = '2';
    const provider = new RootProvider(new Map(), new Map(), meta);

    const scopeProvider = new ScopeProvider(scopeId, provider, new Map([['service', (data) => {
      assert.equal((data as { name: number }).name, 1);
      assert.equal((data as { scopeId: string }).scopeId, scopeId);
      done();
      return 1;
    }]]), meta);
    scopeProvider.getService('service');
  });

  it('scope service should be ok', () => {
    const scopeId = '2';
    const provider = new RootProvider(new Map(), new Map());
    const scopeProvider = new ScopeProvider(scopeId, provider, new Map([['service', () => 1]]));
    assert.equal(scopeProvider.getService('service'), 1);
  });

  it('shared service should be ok', () => {
    const scopeId = 'ScopeA';

    const factories = new Map();
    const sharedFactories: SharedServiceFactoryMap = new Map([[scopeId, new Map([[
      'serviceFromShared', {
        scopes: [scopeId],
        factory: () => 1,
      }
    ]])]]);
    const provider = new RootProvider(factories, sharedFactories);

    const scopeProvider = new ScopeProvider(scopeId, provider, new Map());
    assert.equal(scopeProvider.getService('serviceFromShared'), 1);
  });

  it('root service should be ok', () => {
    const scopeId = 'ScopeA';

    const factories = new Map([['serviceFromRoot', () => 2]]);
    const sharedFactories: SharedServiceFactoryMap = new Map([[scopeId, new Map([[
      'serviceFromShared', {
        scopes: [scopeId],
        factory: () => 1,
      }
    ]])]]);
    const provider = new RootProvider(factories, sharedFactories);

    const scopeProvider = new ScopeProvider(scopeId, provider, new Map());
    assert.equal(scopeProvider.getService('serviceFromRoot'), 2);
  });

  it('parent service should be ok', () => {
    const scopeId = 'ScopeA';

    const factories = new Map([['serviceFromRoot', () => 2]]);
    const sharedFactories: SharedServiceFactoryMap = new Map([[scopeId, new Map([[
      'serviceFromShared', {
        scopes: [scopeId],
        factory: () => 1,
      }
    ]])]]);
    const provider = new RootProvider(factories, sharedFactories);

    const parentScopeProvider = new ScopeProvider(scopeId, provider, new Map([['serviceFromParent', () => 3]]));
    const scopeProvider = new ScopeProvider(scopeId, provider, new Map());
    scopeProvider.setParent(parentScopeProvider);
    assert.equal(scopeProvider.getService('serviceFromParent'), 3);
    assert.equal(scopeProvider.getService('serviceFromShared'), 1);
    assert.equal(scopeProvider.getService('serviceFromRoot'), 2);
  });
});
