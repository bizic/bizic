import { strict as assert } from 'assert';
import Container from '../../src/di/container';

class TestableContainer extends Container {
  getServiceFactories() {
    return this.serviceFactories;
  }

  getScopedServiceFactories() {
    return this.scopedServiceFactories;
  }

  getSharedServiceFactories() {
    return this.sharedServiceFactories;
  }
}

describe('core/src/di/container', () => {
  it('get root provider should be ok', (done) => {
    const container = new TestableContainer();
    container.registerServiceFactory('test', (data) => {
      assert.equal((data as { some: string }).some, 'hi');
      done();
      return 1;
    });
    const provider = container.getRootProvider({ some: 'hi' });
    assert(provider);
    provider.getService('test');
  });

  it('register service factory should be ok', () => {
    const container = new TestableContainer();

    const serviceAFactory = () => 'serviceA';
    const serviceBFactory = () => 'serviceB';

    container.registerServiceFactory('serviceA', serviceAFactory);
    container.registerServiceFactory('serviceB', serviceBFactory);

    const factories = container.getServiceFactories();
    assert.equal(factories.size, 2);
    assert.equal(factories.get('serviceA'), serviceAFactory);
    assert.equal(factories.get('serviceB'), serviceBFactory);
  });

  it('register scoped service factory should be ok', () => {
    const container = new TestableContainer();

    const serviceAFactory = () => 'serviceA';
    const serviceBFactory = () => 'serviceB';
    const serviceCFactory = () => 'serviceC';

    container.registerScopedServiceFactory('scopeA', 'serviceA', serviceAFactory);
    container.registerScopedServiceFactory('scopeA', 'serviceB', serviceBFactory);
    container.registerScopedServiceFactory('scopeC', 'serviceC', serviceCFactory);

    const factories = container.getScopedServiceFactories();
    assert.equal(factories.size, 2);

    const scopeAFactories = factories.get('scopeA');
    assert(scopeAFactories);
    assert.equal(scopeAFactories.size, 2);
    assert.equal(scopeAFactories.get('serviceA'), serviceAFactory);
    assert.equal(scopeAFactories.get('serviceB'), serviceBFactory);

    const scopeBFactories = factories.get('scopeC');
    assert(scopeBFactories);
    assert.equal(scopeBFactories.size, 1);
    assert.equal(scopeBFactories.get('serviceC'), serviceCFactory);
  });

  it('register shared scoped service factory should be ok', () => {
    const container = new TestableContainer();

    const serviceABFactory = () => 'serviceAB';
    const serviceACDFactory = () => 'serviceACD';
    const serviceCFactory = () => 'serviceC';

    container.registerSharedServiceFactory(['scopeA', 'scopeB'], 'serviceAB', serviceABFactory);
    container.registerSharedServiceFactory(['scopeA', 'scopeC', 'scopeD'], 'serviceACD', serviceACDFactory);
    container.registerSharedServiceFactory(['scopeC'], 'serviceC', serviceCFactory);

    const sharedServiceFactories = container.getSharedServiceFactories();
    assert.equal(sharedServiceFactories.size, 4);

    const scopeAFactories = sharedServiceFactories.get('scopeA');
    assert(scopeAFactories);
    assert.equal(scopeAFactories.size, 2);
    assert.equal(scopeAFactories.get('serviceAB')?.factory, serviceABFactory);
    assert.equal(scopeAFactories.get('serviceACD')?.factory, serviceACDFactory);

    const scopeBFactories = sharedServiceFactories.get('scopeB');
    assert(scopeBFactories);
    assert.equal(scopeBFactories.size, 1);
    assert.equal(scopeBFactories.get('serviceAB')?.factory, serviceABFactory);

    const scopeCFactories = sharedServiceFactories.get('scopeC');
    assert(scopeCFactories);
    assert.equal(scopeCFactories.size, 2);
    assert.equal(scopeCFactories.get('serviceACD')?.factory, serviceACDFactory);
    assert.equal(scopeCFactories.get('serviceC')?.factory, serviceCFactory);

    const scopeDFactories = sharedServiceFactories.get('scopeD');
    assert(scopeDFactories);
    assert.equal(scopeDFactories.size, 1);
    assert.equal(scopeDFactories.get('serviceACD')?.factory, serviceACDFactory);
  });

  it('get scoped provider should be ok', () => {
    const container = new TestableContainer();
    const scopeId = 'scopeA';
    const serviceAFactory = () => 'serviceAInstance';

    container.registerScopedServiceFactory(scopeId, 'serviceA', serviceAFactory);
    const rootProvider = container.getRootProvider();
    const provider = container.getScopedProvider(scopeId, rootProvider);
    assert.equal(provider.getService('serviceA'), 'serviceAInstance');
  });

  it('get scoped provider should be ok with meta argument', () => {
    const container = new TestableContainer();
    const scopeId = 'scopeA';
    const serviceAFactory = (data: unknown) => {
      assert.equal((data as { name: string }).name, 'test');
      return 'serviceAInstance';
    };

    container.registerScopedServiceFactory(scopeId, 'serviceA', serviceAFactory);
    const rootProvider = container.getRootProvider();

    const provider = container.getScopedProvider(scopeId, rootProvider, { name: 'test' });
    assert.equal(provider.getService('serviceA'), 'serviceAInstance');
  });
});
